import {Component} from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: 'info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
    participantTypes = [
        { id: 'yourself', text: 'Yourself' },
        { id: 'someone-like-you', text: 'Someone like you'},
        { id: 'someone-like-you', text: 'Someone NOT like you' },
        { id: 'optional-particpant', text: 'Optional Particpant' }
    ];
    info = {
        name: '',
        type: '',
        device: '',
        alias: ''
    };
    constructor(private appService: AppService, private router: Router) {}
    next() {
        this.appService.info = this.info;
        this.router.navigate(['/test']);
    }
}
