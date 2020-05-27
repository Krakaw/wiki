const TEMPLATE_ID = '';
const OUTPUT_FOLDER_ID = '';
const TIMEZONE_OFFSET = 120 * 60000;
const FILENAME_GENERATOR = ['Your Field Key', '___date', '___time', 'static string'];
const VALUE_PROCESSORS = {
  'Date Only': _processorDateOnly,
};

function autoFillGoogleDocFromForm(e) {
    const values = getValues(e.namedValues);
    //file is the template file, and you get it by ID
    const file = DriveApp.getFileById(TEMPLATE_ID);
    //We can make a copy of the template, name it, and optionally tell it what folder to live in
    //file.makeCopy will return a Google Drive file object
    const folder = DriveApp.getFolderById(OUTPUT_FOLDER_ID);
    const filename = FILENAME_GENERATOR.map(v => values[v] || v).join(' ');
    const copy = file.makeCopy(filename, folder);
    //Once we've got the new file created, we need to open it as a document by using its ID
    const doc = DocumentApp.openById(copy.getId());
    //Since everything we need to change is in the body, we need to get that
    const body = doc.getBody();
    Object.keys(values).forEach((field) => {
        body.replaceText('{{' + field + '}}', values[field] || '');
    });
    //Lastly we save and close the document to persist our changes
    doc.saveAndClose();
}

function _dateTimeFromUtc(dateTimeString) {
    const timestampUtc = (new Date(dateTimeString)).getTime();
    const offsetTimestampDate = new Date(timestampUtc + TIMEZONE_OFFSET)
    const [date, rawTime] = offsetTimestampDate.toISOString().split('T');
    const [time, _] = rawTime.split('.');
    return {date, time};
}

function _processorDateOnly(value) {
    const {date} = _dateTimeFromUtc(value);
    return date;
}

function processValues(values) {
    for (let field in VALUE_PROCESSORS) {
        const value = values[field];
        if (!value) {
            continue;
        }
        values[field] = VALUE_PROCESSORS[field](value);
    }
    return values;
}

function getValues(values) {
    const result = {};
    for (let field in values) {
        // There is some regex interpretation in the `body.replaceText` function so we need to escape ( and )
        let fieldKey = field.replace('(', '\\(').replace(')', '\\)').trim();
        result[fieldKey] = values[field].pop()
    }
    const {date: ___date, time: ___time} = _dateTimeFromUtc(result["Timestamp"]);
    return {
        ...processValues(result),
        ___date,
        ___time
    };
}

// Generate the selected row in the active sheet
function generateRow() {
    const spreadsheet = SpreadsheetApp.getActive();
    const sheet = spreadsheet.getActiveSheet();
    const cellRange = sheet.getActiveCell();
    const selectedRow = cellRange.getRow();
    const dataIndex = selectedRow - 2; // -1 because it is 1 indexed array, -1 again because we shift off the headers
    const data = sheet.getDataRange().getValues();
    const headers = data.shift();
    const namedValues = {};
    headers.forEach((header, i) => {
        namedValues[header] = [data[dataIndex][i]]
    })
    autoFillGoogleDocFromForm({namedValues})
}
