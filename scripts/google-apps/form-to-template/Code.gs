const TEMPLATE_ID = '';
const OUTPUT_FOLDER_ID = '';
const TIMEZONE_OFFSET = 120 * 60000;
const FILENAME_GENERATOR = ['Your Field Key', '___date', '___time', 'static string'];
const VALUE_PROCESSORS = {
  'Date Only': _processorDateOnly,
};

function autoFillGoogleDocFromForm(e) {

    var values = getValues(e.namedValues);

    //file is the template file, and you get it by ID
    var file = DriveApp.getFileById(TEMPLATE_ID);

    //We can make a copy of the template, name it, and optionally tell it what folder to live in
    //file.makeCopy will return a Google Drive file object
    var folder = DriveApp.getFolderById(OUTPUT_FOLDER_ID);

    var filename = FILENAME_GENERATOR.map(v => values[v] || v).join(' ');
    var copy = file.makeCopy(filename, folder);

    //Once we've got the new file created, we need to open it as a document by using its ID
    var doc = DocumentApp.openById(copy.getId());

    //Since everything we need to change is in the body, we need to get that
    var body = doc.getBody();

    Object.keys(values).forEach((field) => {
        body.replaceText('{{' + field + '}}', values[field] || '');
    });

    //Lastly we save and close the document to persist our changes
    doc.saveAndClose();
}

function _dateTimeFromUtc(dateTimeString) {
    Logger.log(dateTimeString)
    var timestampDate = new Date(dateTimeString);

    var timestampUtc = timestampDate.getTime();
    var offsetTimestamp = timestampUtc + TIMEZONE_OFFSET;
    timestampDate = new Date(offsetTimestamp)

    var [date, time] = timestampDate.toISOString().split('T');
    var [time, _] = time.split('.');
    return {date, time};
}

function _processorDateOnly(value) {
    const {date} = _dateTimeFromUtc(value);
    return date;
}

function processValues(values) {
    for (let field in VALUE_PROCESSORS) {
        let value = values[field];
        if (!value) {
            continue;
        }
        values[field] = VALUE_PROCESSORS[field](value);
    }
    return values;
}

function getValues(values, sheet) {
    var result = {};

    for (let field in values) {
        let fieldKey = field.replace('(', '\\(').replace(')', '\\)').trim();
        result[fieldKey] = values[field].pop()
    }
    
    const {date: ___date, time: ___time} = _dateTimeFromUtc(result["Timestamp"]);
    const processedValues = {
        ...processValues(result),
        ___date,
        ___time
    }

    return processedValues;
}

// Generate the selected row in the active sheet
function generateRow() {
    var spreadsheet = SpreadsheetApp.getActive();
    var sheet = spreadsheet.getActiveSheet();
    var cellRange = sheet.getActiveCell();
    var selectedRow = cellRange.getRow();
    var dataIndex = selectedRow - 2; // -1 because it is 1 indexed array, -1 again because we shift off the headers

    var data = sheet.getDataRange().getValues();
    var headers = data.shift();

    var namedValues = {};
    headers.forEach((header, i) => {
        namedValues[header] = [data[dataIndex][i]]
    })

    autoFillGoogleDocFromForm({namedValues})
}
