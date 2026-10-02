// Google Apps Script: deploy as a Web App ("Anyone" access) bound to the admin Google Sheet.
// Project Settings > Script properties: SECRET = same value as GOOGLE_SHEETS_WEBHOOK_SECRET.
const HEADERS = ['submittedAt', 'clientId', 'firstName', 'lastName', 'phone', 'email', 'contactPref',
  'childCount', 'childAges', 'needsChildcare', 'referredBy', 'track', 'sessionLabel', 'notes', 'source'];

function doPost(e) {
  const { secret, row } = JSON.parse(e.postData.contents);
  if (secret !== PropertiesService.getScriptProperties().getProperty('SECRET')) {
    return ContentService.createTextOutput('forbidden');
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  const ids = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
  if (!ids.includes(row.clientId)) sheet.appendRow(HEADERS.map((h) => row[h] ?? ''));
  return ContentService.createTextOutput('ok');
}
