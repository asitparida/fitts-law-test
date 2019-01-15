import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';

export class Coordinate {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class DataItem {
    targetHit: boolean;
    ticks;
    direction: Direction;
    sourceIndex;
    angle: Clock;
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
export class FittsTestComponent implements AfterViewInit {
    title = 'fitts-law-tester';
    workAreaId = 'work-area' + Math.floor(Math.random() * 10e6);
    svgAreaId = 'svg-work-area' + Math.floor(Math.random() * 10e6);
    oTesterId = 'o-test' + Math.floor(Math.random() * 10e6);
    currentRadius = 50;
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
    currentPerformanceTick = null;
    currentDataSet: Array<DataItem> = [];
    countdownTickCount = -1;
    currentTestCount = -1;
    maxTests = 2;
    maxTicks = 3;
    countdownTick = this.maxTicks;
    constructor() { }
    ngAfterViewInit() {
        this.dim = this.getSquareDimension();
        this.maxRadius = this.dim / 6;
        this.minRadius = this.getMinRadius();
        const width = this.dim;
        const height = this.dim;
        this.pageCenter = new Coordinate(width / 2, height / 2);
        this.processCurrentRadius();
    }
    beginPractice() {
        this.isPracticeRun = true;
        this.showPracticeModal = false;
        this.showCountdownModal = true;
        this.countdownTick = this.maxTicks;
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
        this.currentRadius = _.sample(_.range(this.minRadius, this.maxRadius, 10));
        this.baseRadius = (this.dim - (this.currentRadius * 2)) * 0.5;
        this.svgElem = document.getElementById(this.svgAreaId);
        d3.select(this.svgElem).attr('width', width);
        d3.select(this.svgElem).attr('height', height);
        this.layoutCurrentRadiusBox();
        this.layourtCurrentCircles();
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
    layourtCurrentCircles() {
        this.fittCircles.forEach(c => (c as d3.Selection<any, any, any, any>).remove());
        this.fittCircles = [];
        d3.select('.fitt-circle').remove();
        const circleCoordinates = this.getCurrentCircleCoordinates();
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
        this.currentDataSet = [];
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
            this.showAllDoneModal = true;
        }
    }
    startTest() {
        this.isPracticeRun = false;
        this.showActualTestModal = false;
        this.showCountdownModal = true;
        this.countdownTick = this.maxTicks;
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
        } else {
            this.currentPerformanceTick = performance.now();
        }
    }
    activateCircle(index) {
        this.fittCircles.forEach((x, i) => {
            if (i === index) {
                x.attr('fill', this.color);
            } else {
                x.attr('fill', 'rgba(0,0,0,0.05)');
            }
        });
    }
    processClick(isCorrectClick,  lastCircleIndex, now, dir) {
        const ticks = now - this.currentPerformanceTick;
        let direction = Direction.None;
        if (isCorrectClick) {
            direction = this.getHitDirection(lastCircleIndex, dir);
        }
        const item = {
            direction: direction,
            sourceIndex: lastCircleIndex,
            ticks: ticks,
            targetHit: isCorrectClick,
            angle: dir === 1 ? Clock.clockwise : Clock.antiClockwise
        };
        this.currentDataSet.push(item);
        this.currentPerformanceTick = performance.now();
    }
    getHitDirection(lastCircleIndex, dir) {
        let direction = Direction.Other;
        if (dir === 1) {
            switch (lastCircleIndex) {
                case 1 : { direction = Direction.Vertical; break; }
                case 2 : { direction = Direction.Other; break; }
                case 3 : { direction = Direction.Diagonal; break; }
                case 4 : { direction = Direction.Other; break; }
                case 5 : { direction = Direction.Horizontal; break; }
                case 6 : { direction = Direction.Other; break; }
                case 7 : { direction = Direction.Diagonal; break; }
            }
        } else {
            switch (lastCircleIndex) {
                case 0 : { direction = Direction.Vertical; break; }
                case 1 : { direction = Direction.Other; break; }
                case 2 : { direction = Direction.Diagonal; break; }
                case 3 : { direction = Direction.Other; break; }
                case 4 : { direction = Direction.Horizontal; break; }
                case 5 : { direction = Direction.Other; break; }
                case 6 : { direction = Direction.Diagonal; break; }
            }
        }
        return direction;
    }

    @HostListener('document:click', ['$event'])
    documentClick(e: MouseEvent) {
        const now = performance.now();
        const dir = this.dir;
        if (this.testInProgress) {
            const lastCircleIndex = this.currentIndexActive;
            let correctClick = false;
            const elem = e.target as HTMLElement;
            if (elem.classList.contains('fitt-circle')) {
                correctClick = true;
            }
            if (this.dir === 1 && (this.currentIndexActive + this.dir) > this.fittCircles.length - 1) {
                this.dir = -1;
                this.currentIndexActive += this.dir;
            } else if (this.dir === -1 && (this.currentIndexActive + this.dir) < 0) {
                this.dir = 1;
                this.currentIndexActive += this.dir;
            } else {
                this.currentIndexActive += this.dir;
            }
            this.processClick(correctClick, lastCircleIndex, now, dir);
            this.activateCircle(this.currentIndexActive);
            this.clickCounter += 1;
            this.checkForTestSession();
        }
    }

    getSquareDimension() {
        if (window.innerHeight > window.innerWidth) {
            return window.innerWidth - 60;
        } else {
            return window.innerHeight - 60;
        }
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
}

