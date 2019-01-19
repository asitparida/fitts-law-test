import { Injectable } from '@angular/core';
declare var gapi: any;
declare var MobileDetect: any;

@Injectable()
export class AppService {
    info = null;
    md = null;
    runAverages = [];
    userAverage = {};
    debugModeTurns = null;
    dpi = null;
    constructor() {
        if (MobileDetect) {
            this.md = new MobileDetect(window.navigator.userAgent);
        }
    }
    getPixels(cmValue) {
        const inches = cmValue / 2.54;
        return this.dpi * inches;
    }
    getCms(pixeslValue) {
        return (pixeslValue * 2.54) / this.dpi;
    }
    appendRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'Runs!A2:O',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
        }, {
                majorDimension: 'ROWS',
                range: 'Runs!A2:O',
                values: data
            }).then(function (response) {
                const range = response.result;
            }, function (response) {
            });
    }
    appendRunAveragesRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'RunAverages!A2:AC',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
        }, {
                majorDimension: 'ROWS',
                range: 'RunAverages!A2:AC',
                values: data
            }).then(function (response) {
                const range = response.result;
            }, function (response) {
            });
    }
    appendUserAveragesRowsToGoogleSheets(data) {
        gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: '1LN7pXxtIvvF2QgRfmj1i5owC0ygRIi2kqJb1nirk1bA',
            range: 'UserAverages!A2:Z',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS'
        }, {
                majorDimension: 'ROWS',
                range: 'UserAverages!A2:Z',
                values: data
            }).then(function (response) {
                const range = response.result;
            }, function (response) {
            });
    }
    isMobile() {
        if (this.md) {
            // tslint:disable-next-line:max-line-length
            const value = this.md.mobile() || this.md.phone() || this.md.tablet() || this.md.is('iPhone') || this.md.is('Android') || this.md.is('android');
            if (value) {
                return true;
            }
            return false;
        }
        return false;
    }
    calculateDPI(diagonalWidth) {
        const dppx = window.devicePixelRatio ||
            // tslint:disable
            (window.matchMedia && window.matchMedia("(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 1.5),(-moz-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)").matches ? 2 : 1) ||
            1;
        const width = screen.width * 1;
        const height = screen.height * 1;
        this.dpi = calcDpi(width, height, diagonalWidth, 'd');;
        return this.dpi;
        // tslint:enable
    }
}

function calcDpi(w, h, d, opt) {
    // Calculate PPI/DPI
    w = w > 0 ? w : 1;
    h = h > 0 ? h : 1;
    opt = opt ? opt : 'd';
    const dpi = (opt === 'd' ? Math.sqrt(w * w + h * h) : opt === 'w' ? w : h) / d;
    return dpi > 0 ? Math.round(dpi) : 0;
}

