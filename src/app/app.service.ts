import { Injectable } from '@angular/core';
declare var gapi: any;
declare var MobileDetect: any;

@Injectable()
export class AppService {
    info = null;
    md = null;
    runAverages = [];
    userAverages = [];
    constructor() {
        if (MobileDetect) {
            this.md = new MobileDetect(window.navigator.userAgent);
        }
    }
    appendRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'Runs!A2:K',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
          }, {
            majorDimension: 'ROWS',
            range: 'Runs!A2:K',
            values: data
          }).then(function (response) {
            const range = response.result;
          }, function (response) {
          });
    }
    appendRunAveragesRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'RunAverages!A2:AD',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
          }, {
            majorDimension: 'ROWS',
            range: 'RunAverages!A2:AD',
            values: data
          }).then(function (response) {
            const range = response.result;
          }, function (response) {
          });
    }
    appendUserAveragesRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'UserAverages!A2:AA',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
          }, {
            majorDimension: 'ROWS',
            range: 'UserAverages!A2:AA',
            values: data
          }).then(function (response) {
            const range = response.result;
          }, function (response) {
          });
    }
    isMobile() {
        if (this.md) {
            // tslint:disable-next-line:max-line-length
            const value = this.md.mobile() || this.md.phone() || this.md.tablet() || this.md.is('iPhone')  || this.md.is('Android') || this.md.is('android');
            if (value) {
                return true;
            }
            return false;
        }
        return false;
    }
}
