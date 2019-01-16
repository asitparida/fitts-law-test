import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { AppService } from '../app.service';
declare var DocumentTouch: any;

export class Coordinate {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class DataItem {
    direction: Direction;
    sourceIndex: number;
    ticks: number;
    targetHit: boolean;
    angle: Clock;
    timestamp: number;
    run: string;
    radius: number;
    distance: number;
}

export class DataAverage {
    run: string;
    radius: number;
    distance: number;
    averageTicks: number;
    averageVerticalTicks: number;
    averageHorizontalTicks: number;
    averageOtherTicks: number;
    hits;
    misses;
    verticalHits;
    verticalMisses;
    horizontalHits;
    horizontalMisses;
    otherHits;
    otherMisses;
    hitPercentage;
    missPercentage;
    verticalHitPecentage;
    verticalMissPecentage;
    horizontalHitPecentage;
    horizontalMissPecentage;
    otherDirectionHitPecentage;
    otherDirectionMissPecentage;
}
export class UserAverage {
    averageTicks: number;
    averageVerticalTicks: number;
    averageHorizontalTicks: number;
    averageOtherTicks: number;
    hits;
    misses;
    verticalHits;
    verticalMisses;
    horizontalHits;
    horizontalMisses;
    otherHits;
    otherMisses;
    hitPercentage;
    missPercentage;
    verticalHitPecentage;
    verticalMissPecentage;
    horizontalHitPecentage;
    horizontalMissPecentage;
    otherDirectionHitPecentage;
    otherDirectionMissPecentage;
}

export enum Direction {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
    Diagonal = 'Diagonal',
    Other = 'Other',
    None = '-'
}

export enum Clock {
    clockwise = 'Clockwise',
    antiClockwise = 'Anti-Clockwise'
}

@Component({
    selector: 'app-fitts-test',
    templateUrl: './fitts-test.component.html',
    styleUrls: ['./fitts-test.component.scss']
})
export class FittsTestComponent implements AfterViewInit, OnInit {
    title = 'fitts-law-tester';
    workAreaId = 'work-area' + Math.floor(Math.random() * 10e6);
    svgAreaId = 'svg-work-area' + Math.floor(Math.random() * 10e6);
    oTesterId = 'o-test' + Math.floor(Math.random() * 10e6);
    currentRadius = 50;
    currentDistance = null;
    baseRadius = null;
    maxRadius = null;
    minRadius = null;
    svgElem;
    dim;
    workingDim;
    pad = 60;
    pageCenter;
    fittRadiusCircle: d3.Selection<any, any, any, any> = null;
    fittCircles: Array<d3.Selection<any, any, any, any>> = [];
    showFittRadiusCircle = false;
    color = '#3498db';
    testInProgress = false;
    currentIndexActive = null;
    dir = 1;
    clickCounter = 0;
    isPracticeRun = true;
    showPracticeModal = true;
    showCountdownModal = false;
    showTestCompleteModal = false;
    showActualTestModal = false;
    showAllDoneModal = false;
    showModal = true;
    isMobile = false;
    currentPerformanceTick = null;
    currentDataSet: Array<DataItem | any> = [];
    overallDataSet: Array<DataItem | any> = [];
    overallAverages: Array<DataAverage | any> = [];
    countdownTickCount = -1;
    currentTestCount = -1;
    maxTests = 1;
    maxTicks = 4;
    countdownTick = this.maxTicks;
    listener = null;
    userInfo = null;
    constructor(private appService: AppService) { }
    ngAfterViewInit() {
        this.dim = this.getSquareDimension();
        this.maxRadius = this.dim / 6;
        this.minRadius = this.getMinRadius();
        const width = this.dim;
        const height = this.dim;
        this.pageCenter = new Coordinate(width / 2, height / 2);
        this.processCurrentRadius();
        const supported = this.checkTouchSupport();
        if (supported) {
            document.addEventListener('touchstart', this.listener);
        } else {
            document.addEventListener('click', this.listener);
        }
    }
    ngOnInit() {
        this.isMobile = this.appService.isMobile();
        this.userInfo = this.appService.info;
        this.listener = (e: any) => {
            const now = performance.now();
            const dir = this.dir;
            if (this.testInProgress) {
                const lastCircleIndex = this.currentIndexActive;
                let correctClick = false;
                const elem = e.target as HTMLElement;
                if (elem.classList.contains('fitt-circle') && elem.classList.contains('active')) {
                    correctClick = true;
                    if (this.dir === 1 && (this.currentIndexActive + this.dir) > this.fittCircles.length - 1) {
                        this.dir = -1;
                        this.currentIndexActive += this.dir;
                    } else if (this.dir === -1 && (this.currentIndexActive + this.dir) < 0) {
                        this.dir = 1;
                        this.currentIndexActive += this.dir;
                    } else {
                        this.currentIndexActive += this.dir;
                    }
                    this.activateCircle(this.currentIndexActive);
                    this.clickCounter += 1;
                } else {
                    this.highlightCurrentCircleAsIncorrect();
                }
                this.processClick(correctClick, lastCircleIndex, now, dir);
                this.checkForTestSession();
            }
        };
    }
    checkTouchSupport() {
        if (('ontouchstart' in window) || (window as any).DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }
        return false;
    }
    beginPractice() {
        this.isPracticeRun = true;
        this.showPracticeModal = false;
        this.showCountdownModal = true;
        this.countdownTick = this.maxTicks;
        this.pickRadius();
        this.layoutCurrentRadiusBox();
        this.layourtCurrentCircles();
        const interval = setInterval(() => {
            this.countdownTick = this.countdownTick - 1;
            if (this.countdownTick === 0) {
                clearInterval(interval);
                this.showCountdownModal = false;
                this.showModal = false;
                this.setupClickTest();
            }
        }, 1000);
    }
    processCurrentRadius() {
        const width = this.dim;
        const height = this.dim;
        this.pickRadius();
        this.svgElem = document.getElementById(this.svgAreaId);
        d3.select(this.svgElem).attr('width', width);
        d3.select(this.svgElem).attr('height', height);
        this.layoutCurrentRadiusBox();
        this.layourtCurrentCircles();
    }
    pickRadius() {
        const range = _.range(this.minRadius, this.maxRadius, 1);
        this.currentRadius = _.sample(range);
        this.baseRadius = (this.dim - (this.currentRadius * 2)) * 0.5;
    }
    layoutCurrentRadiusBox() {
        if (this.fittRadiusCircle) {
            (this.fittRadiusCircle as d3.Selection<any, any, any, any>).remove();
        }
        if (this.showFittRadiusCircle) {
            this.fittRadiusCircle = d3.select(this.svgElem)
                .append('circle')
                .attr('class', 'fitt-radius-circle')
                .attr('cx', this.pageCenter.x)
                .attr('cy', this.pageCenter.y)
                .attr('r', this.baseRadius)
                .attr('fill', '#000')
                .attr('stroke', '#d0d0d0')
                .attr('fill', 'none')
                .attr('stroke-width', '1px');
        }
    }
    getDistance(a: Coordinate, b: Coordinate) {
        const xDiff = a.x - b.x;
        const yDiff = a.y - b.y;
        return Math.sqrt(((xDiff * xDiff) + (yDiff * yDiff)));
    }
    layourtCurrentCircles() {
        this.fittCircles.forEach(c => (c as d3.Selection<any, any, any, any>).remove());
        this.fittCircles = [];
        d3.select('.fitt-circle').remove();
        const circleCoordinates = this.getCurrentCircleCoordinates();
        this.currentDistance = this.getDistance(circleCoordinates[0], circleCoordinates[1]);
        circleCoordinates.forEach((c, i) => {
            const circle = d3.select(this.svgElem)
                .append('circle')
                .attr('class', 'fitt-circle')
                .attr('id', `fitt-circle-${i}`)
                .attr('cx', c.x)
                .attr('cy', c.y)
                .attr('r', this.currentRadius)
                .attr('fill', 'rgba(0,0,0,0.05)')
                ;
            this.fittCircles.push(circle);
        });
    }
    getCurrentCircleCoordinates() {
        const angle = 45;
        const hypontenuse = this.baseRadius;
        const xIntercept = hypontenuse * Math.cos(this.toRadians(angle));
        const yIntercept = hypontenuse * Math.sin(this.toRadians(angle));
        const pageCenter = this.pageCenter;

        const circleCoordinates = [
            new Coordinate(this.dim / 2, this.currentRadius),
            new Coordinate(this.dim / 2, this.dim - this.currentRadius),
            new Coordinate(pageCenter.x + xIntercept, pageCenter.y - yIntercept),
            new Coordinate(pageCenter.x - xIntercept, pageCenter.y + yIntercept),
            new Coordinate(this.dim - this.currentRadius, this.dim / 2),
            new Coordinate(this.currentRadius, this.dim / 2),
            new Coordinate(pageCenter.x + xIntercept, pageCenter.y + yIntercept),
            new Coordinate(pageCenter.x - xIntercept, pageCenter.y - yIntercept)
        ];
        return circleCoordinates;
    }
    setupClickTest() {
        this.currentDataSet = [];
        if (this.currentIndexActive === null) {
            this.testInProgress = true;
            this.currentIndexActive = 0;
            this.currentPerformanceTick = performance.now();
        }
        this.activateCircle(this.currentIndexActive);

    }
    clearTest() {
        this.clickCounter = 0;
        this.currentIndexActive = -1;
        this.activateCircle(this.currentIndexActive);
        this.currentIndexActive = null;
        this.currentPerformanceTick = null;
        this.showModal = true;
        this.showTestCompleteModal = true;
        if (!this.isPracticeRun) {
            this.calculateCurrentAverage();
            this.overallDataSet = this.overallDataSet.concat(this.currentDataSet);
        }
        this.currentDataSet = [];
    }
    calculateCurrentAverage() {
        const average = new DataAverage();
        average.run = (this.currentDataSet as Array<DataItem>)[0].run;
        average.distance = (this.currentDataSet as Array<DataItem>)[0].distance;
        average.radius = (this.currentDataSet as Array<DataItem>)[0].radius;
        const hitTicks = (this.currentDataSet as Array<DataItem>).filter(x => x.targetHit);
        const missTicks = (this.currentDataSet as Array<DataItem>).filter(x => !x.targetHit);
        const verticalHits = hitTicks.filter(t => t.direction === Direction.Vertical);
        const verticalMisses = missTicks.filter(t => t.direction === Direction.Vertical);
        const horizontalHits = hitTicks.filter(t => t.direction === Direction.Horizontal);
        const horizontalMisses = missTicks.filter(t => t.direction === Direction.Horizontal);
        const otherHits = hitTicks.filter(t => t.direction === Direction.Other);
        const otherMisses = missTicks.filter(t => t.direction === Direction.Other);
        average.averageTicks = _.mean(hitTicks.map(t => t.ticks));
        average.averageVerticalTicks = _.mean(verticalHits.map(t => t.ticks));
        average.averageHorizontalTicks = _.mean(horizontalHits.map(t => t.ticks));
        average.averageOtherTicks = _.mean(otherHits.map(t => t.ticks));
        average.hits = hitTicks.length;
        average.misses = missTicks.length;
        average.verticalHits = verticalHits.length;
        average.verticalMisses = verticalMisses.length;
        average.horizontalHits = horizontalHits.length;
        average.horizontalMisses = horizontalMisses.length;
        average.otherHits = otherHits.length;
        average.otherMisses = otherMisses.length;
        average.hitPercentage = (hitTicks.length / (hitTicks.length + missTicks.length)) * 100;
        average.missPercentage = (missTicks.length / (hitTicks.length + missTicks.length)) * 100;
        average.verticalHitPecentage = (verticalHits.length / (verticalHits.length + verticalMisses.length)) * 100;
        average.verticalMissPecentage = (verticalMisses.length / (verticalHits.length + verticalMisses.length)) * 100;
        average.horizontalHitPecentage = (horizontalHits.length / (horizontalHits.length + horizontalMisses.length)) * 100;
        average.horizontalMissPecentage = (horizontalMisses.length / (horizontalHits.length + horizontalMisses.length)) * 100;
        average.otherDirectionHitPecentage = (otherHits.length / (otherHits.length + otherMisses.length)) * 100;
        average.otherDirectionMissPecentage = (otherMisses.length / (otherHits.length + otherMisses.length)) * 100;
        const averageObj = Object.assign({}, this.userInfo, {
            run: average.run,
            radius: average.radius,
            distance: average.distance,
            averageTicks: average.averageTicks,
            averageVerticalTicks: average.averageVerticalTicks,
            averageHorizontalTicks: average.averageHorizontalTicks,
            averageOtherTicks: average.averageOtherTicks,
            hits: average.hits,
            misses: average.misses,
            verticalHits: average.verticalHits,
            verticalMisses: average.verticalMisses,
            horizontalHits: average.horizontalHits,
            horizontalMisses: average.horizontalMisses,
            otherHits: average.otherHits,
            otherMisses: average.otherMisses,
            hitPercentage: average.hitPercentage,
            missPercentage: average.missPercentage,
            verticalHitPecentage: average.verticalHitPecentage,
            verticalMissPecentage: average.verticalMissPecentage,
            horizontalHitPecentage: average.horizontalHitPecentage,
            horizontalMissPecentage: average.horizontalMissPecentage,
            otherDirectionHitPecentage: average.otherDirectionHitPecentage,
            otherDirectionMissPecentage: average.otherDirectionMissPecentage
        });
        this.overallAverages.push(averageObj);
    }
    calculateOverallUserAverage() {
        const average = new UserAverage();
        const hitTicks = (this.overallDataSet as Array<DataItem>).filter(x => x.targetHit);
        const missTicks = (this.overallDataSet as Array<DataItem>).filter(x => !x.targetHit);
        const verticalHits = hitTicks.filter(t => t.direction === Direction.Vertical);
        const verticalMisses = missTicks.filter(t => t.direction === Direction.Vertical);
        const horizontalHits = hitTicks.filter(t => t.direction === Direction.Horizontal);
        const horizontalMisses = missTicks.filter(t => t.direction === Direction.Horizontal);
        const otherHits = hitTicks.filter(t => t.direction === Direction.Other);
        const otherMisses = missTicks.filter(t => t.direction === Direction.Other);
        average.averageTicks = _.mean(hitTicks.map(t => t.ticks));
        average.averageVerticalTicks = _.mean(verticalHits.map(t => t.ticks));
        average.averageHorizontalTicks = _.mean(horizontalHits.map(t => t.ticks));
        average.averageOtherTicks = _.mean(otherHits.map(t => t.ticks));
        average.hits = hitTicks.length;
        average.misses = missTicks.length;
        average.verticalHits = verticalHits.length;
        average.verticalMisses = verticalMisses.length;
        average.horizontalHits = horizontalHits.length;
        average.horizontalMisses = horizontalMisses.length;
        average.otherHits = otherHits.length;
        average.otherMisses = otherMisses.length;
        average.hitPercentage = (hitTicks.length / (hitTicks.length + missTicks.length)) * 100;
        average.missPercentage = (missTicks.length / (hitTicks.length + missTicks.length)) * 100;
        average.verticalHitPecentage = (verticalHits.length / (verticalHits.length + verticalMisses.length)) * 100;
        average.verticalMissPecentage = (verticalMisses.length / (verticalHits.length + verticalMisses.length)) * 100;
        average.horizontalHitPecentage = (horizontalHits.length / (horizontalHits.length + horizontalMisses.length)) * 100;
        average.horizontalMissPecentage = (horizontalMisses.length / (horizontalHits.length + horizontalMisses.length)) * 100;
        average.otherDirectionHitPecentage = (otherHits.length / (otherHits.length + otherMisses.length)) * 100;
        average.otherDirectionMissPecentage = (otherMisses.length / (otherHits.length + otherMisses.length)) * 100;
        const averageObj = Object.assign({}, this.userInfo, {
            averageTicks: average.averageTicks,
            averageVerticalTicks: average.averageVerticalTicks,
            averageHorizontalTicks: average.averageHorizontalTicks,
            averageOtherTicks: average.averageOtherTicks,
            hits: average.hits,
            misses: average.misses,
            verticalHits: average.verticalHits,
            verticalMisses: average.verticalMisses,
            horizontalHits: average.horizontalHits,
            horizontalMisses: average.horizontalMisses,
            otherHits: average.otherHits,
            otherMisses: average.otherMisses,
            hitPercentage: average.hitPercentage,
            missPercentage: average.missPercentage,
            verticalHitPecentage: average.verticalHitPecentage,
            verticalMissPecentage: average.verticalMissPecentage,
            horizontalHitPecentage: average.horizontalHitPecentage,
            horizontalMissPecentage: average.horizontalMissPecentage,
            otherDirectionHitPecentage: average.otherDirectionHitPecentage,
            otherDirectionMissPecentage: average.otherDirectionMissPecentage
        });
        return averageObj;
    }
    nextStepInTest() {
        this.showTestCompleteModal = false;
        if (this.isPracticeRun) {
            this.isPracticeRun = false;
            this.currentTestCount = 1;
        } else {
            this.currentTestCount += 1;
        }
        if (this.currentTestCount <= this.maxTests) {
            this.showActualTestModal = true;
        } else {
            const clickData = this.getSheetTransform(this.overallDataSet);
            const runAverages = this.getSheetTransform(this.overallAverages);
            const average = this.calculateOverallUserAverage();
            const userAverage = this.getSheetTransform([average]);
            this.appService.runAverages = this.overallAverages;
            this.appService.userAverages = average;
            console.log(JSON.stringify(this.overallAverages));
            console.log(JSON.stringify(average));
            this.appService.appendRowsToGoogleSheets(clickData);
            this.appService.appendRunAveragesRowsToGoogleSheets(runAverages);
            this.appService.appendUserAveragesRowsToGoogleSheets(userAverage);
            this.showAllDoneModal = true;
        }
    }
    getSheetTransform(data) {
        const temp = [];
        if (data && data.length > 0) {
            const keys = Object.keys(data[0]);
            data.forEach(d => {
                const values = keys.map(k => d[k]);
                temp.push(values);
            });
        }
        return temp;
    }
    startTest() {
        this.isPracticeRun = false;
        this.showActualTestModal = false;
        this.showCountdownModal = true;
        this.countdownTick = this.maxTicks;
        this.pickRadius();
        this.layoutCurrentRadiusBox();
        this.layourtCurrentCircles();
        const interval = setInterval(() => {
            this.countdownTick = this.countdownTick - 1;
            if (this.countdownTick === 0) {
                clearInterval(interval);
                this.showCountdownModal = false;
                this.showModal = false;
                this.setupClickTest();
            }
        }, 1000);
    }
    checkForTestSession() {
        if (this.clickCounter > 28) {
            this.testInProgress = false;
            this.clearTest();
        }
    }
    activateCircle(index) {
        const fitt = this.fittCircles[this.currentIndexActive];
        if (fitt) {
            fitt.transition();
            fitt.attr('fill', 'rgba(0,0,0,0.05)');
        }
        this.fittCircles.forEach((x, i) => {
            if (i === index) {
                x.attr('fill', this.color);
                x.attr('class', 'fitt-circle active');
            } else {
                x.attr('fill', 'rgba(0,0,0,0.05)');
                x.attr('class', 'fitt-circle');
            }
        });
    }
    highlightCurrentCircleAsIncorrect() {
        const fitt = this.fittCircles[this.currentIndexActive];
        if (fitt) {
            fitt.attr('fill', '#e74c3c')
                .transition()
                .attr('fill', this.color);
        }
    }
    processClick(isCorrectClick, lastCircleIndex, now, dir) {
        const ticks = now - this.currentPerformanceTick;
        let direction = Direction.None;
        direction = this.getHitDirection(lastCircleIndex, dir);
        const item: DataItem | any = Object.assign({}, this.userInfo, {
            direction: direction,
            sourceIndex: lastCircleIndex,
            ticks: ticks,
            targetHit: isCorrectClick,
            angle: dir === 1 ? Clock.clockwise : Clock.antiClockwise,
            timestamp: (new Date()).getTime(),
            run: `RUN #${this.currentTestCount}`,
            radius: this.currentRadius,
            distance: this.currentDistance
        });
        this.currentDataSet.push(item);
        if (isCorrectClick) {
            this.currentPerformanceTick = performance.now();
        }
    }
    getHitDirection(lastCircleIndex, dir) {
        let direction = Direction.Other;
        if (dir === 1) {
            switch (lastCircleIndex) {
                case 1: { direction = Direction.Vertical; break; }
                case 2: { direction = Direction.Other; break; }
                case 3: { direction = Direction.Diagonal; break; }
                case 4: { direction = Direction.Other; break; }
                case 5: { direction = Direction.Horizontal; break; }
                case 6: { direction = Direction.Other; break; }
                case 7: { direction = Direction.Diagonal; break; }
            }
        } else {
            switch (lastCircleIndex) {
                case 0: { direction = Direction.Vertical; break; }
                case 1: { direction = Direction.Other; break; }
                case 2: { direction = Direction.Diagonal; break; }
                case 3: { direction = Direction.Other; break; }
                case 4: { direction = Direction.Horizontal; break; }
                case 5: { direction = Direction.Other; break; }
                case 6: { direction = Direction.Diagonal; break; }
            }
        }
        return direction;
    }

    getSquareDimension() {
        let dim = 0;
        if (window.innerHeight > window.innerWidth) {
            dim = window.innerWidth - 60;
        } else {
            dim = window.innerHeight - 60;
        }
        dim = dim > 500 ? 500 : dim;
        return dim;
    }
    getMinRadius() {
        const elem = document.getElementById(this.oTesterId);
        if (elem) {
            const props = elem.getBoundingClientRect();
            return Math.min(props.height, props.width);
        }
        return 1;
    }
    toRadians(angle) {
        return angle * (Math.PI / 180);
    }
    downloadData() {
        const saveData = (function () {
            const a: any = document.createElement('a');
            document.body.appendChild(a);
            a.style.display = 'none';
            return function (data, fileName) {
                const json = JSON.stringify(data),
                    blob = new Blob([json], { type: 'octet/stream' }),
                    url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                a.click();
                window.URL.revokeObjectURL(url);
            };
        }());
        const obj = Object.assign({}, {
            data: this.overallDataSet
        });
        saveData(obj, `${this.userInfo.alias}-data-json.json`);
    }
    downloadCSVData() {
        let data, filename, link;
        let csv = this.convertArrayOfObjectsToCSV({
            data: this.overallDataSet
        });
        if (csv === null) {
            return;
        }

        filename = `${this.userInfo.alias}-data-csv.csv`;

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }
    convertArrayOfObjectsToCSV(args) {
        let result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) {
                    result += columnDelimiter;
                }

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }
}

