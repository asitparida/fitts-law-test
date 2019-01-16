import { Injectable } from '@angular/core';
declare var gapi: any;

@Injectable()
export class AppService {
    info = null;
    appendRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'Sheet1!A2:K',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
          }, {
            majorDimension: 'ROWS',
            range: 'Sheet1!A2:K',
            values: data
          }).then(function (response) {
            const range = response.result;
            console.log(range);
          }, function (response) {
            console.log(response);
            // appendPre('Error: ' + response.result.error.message);
          });
    }
}
