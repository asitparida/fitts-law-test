import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
    selector: 'app-results',
    templateUrl: 'results.component.html',
    styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
    // tslint:disable 
    runAverages = [
        { "name": "Asit", "alias": "AKPARIDA", "type": "Someone like you", "device": "other", "deviceDetails": "device", "deviceWidth": 10, "deviceHeight": 12, "run": "RUN #1", "radius": 48.671875, "distance": 402.65625, "averageTicks": 605.2517241372823, "averageVerticalTicks": 519.3750000034925, "averageHorizontalTicks": 639.3749999988358, "averageOtherTicks": 617.3769230596148, "hits": 29, "misses": 0, "verticalHits": 4, "verticalMisses": 0, "horizontalHits": 4, "horizontalMisses": 0, "otherHits": 13, "otherMisses": 0, "hitPercentage": 100, "missPercentage": 0, "verticalHitPecentage": 100, "verticalMissPecentage": 0, "horizontalHitPecentage": 100, "horizontalMissPecentage": 0, "otherDirectionHitPecentage": 100, "otherDirectionMissPecentage": 0 },
        { "name": "Asit", "alias": "AKPARIDA", "type": "Someone like you", "device": "other", "deviceDetails": "device", "deviceWidth": 10, "deviceHeight": 12, "run": "RUN #2", "radius": 24.671875, "distance": 450.65625, "averageTicks": 718.5482758675413, "averageVerticalTicks": 719.6500000136439, "averageHorizontalTicks": 653.775000013411, "averageOtherTicks": 752.8999999989397, "hits": 29, "misses": 0, "verticalHits": 4, "verticalMisses": 0, "horizontalHits": 4, "horizontalMisses": 0, "otherHits": 13, "otherMisses": 0, "hitPercentage": 100, "missPercentage": 0, "verticalHitPecentage": 100, "verticalMissPecentage": 0, "horizontalHitPecentage": 100, "horizontalMissPecentage": 0, "otherDirectionHitPecentage": 100, "otherDirectionMissPecentage": 0 }
    ];
    userAverage = { "name": "Asit", "alias": "AKPARIDA", "type": "Someone like you", 'device': "other", "deviceDetails": "device", "deviceWidth": 10, "deviceHeight": 12, "averageTicks": 661.9000000024118, "averageVerticalTicks": 619.5125000085682, "averageHorizontalTicks": 646.5750000061234, "averageOtherTicks": 685.1384615292773, "hits": 58, "misses": 0, "verticalHits": 8, "verticalMisses": 0, "horizontalHits": 8, "horizontalMisses": 0, "otherHits": 26, "otherMisses": 0, "hitPercentage": 100, "missPercentage": 0, "verticalHitPecentage": 100, "verticalMissPecentage": 0, "horizontalHitPecentage": 100, "horizontalMissPecentage": 0, "otherDirectionHitPecentage": 100, "otherDirectionMissPecentage": 0 };
    constructor(private appService: AppService) { }
    ngOnInit() {
    }
}
