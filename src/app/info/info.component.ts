import {Component, OnInit} from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: 'info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
    participantTypes = [
        { id: 'yourself', text: 'Yourself' },
        { id: 'someone-like-you', text: 'Someone like you'},
        { id: 'someone-like-you', text: 'Someone NOT like you' },
        { id: 'optional-particpant', text: 'Optional Particpant' }
    ];
    deviceTypes = [
        'mouse',
        'touchpad',
        'phone touchscreen',
        'tablet touchscreen',
        'laptop touchscreen',
        'other'
    ];
    info = {
        name: '',
        alias: '',
        type: '',
        device: '',
        deviceDetails: '',
        deviceWidth: '',
        deviceHeight: ''
    };
    constructor(private appService: AppService, private router: Router) {}
    ngOnInit() {
        console.log(this.appService.isMobile());
    }
    next() {
        this.appService.info = this.info;
        this.router.navigate(['/test']);
    }
}
