import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FittsTestComponent } from './fitts-test/fitts-test.component';
import { InfoComponent } from './info/info.component';
import { AuthGuard } from './auth.guard';

const appRoutes: Routes = [
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, data: { uid: 1000 } },
    { path: 'test', component: FittsTestComponent, data: { uid: 2000 }, canActivate: [AuthGuard] },
    { path: 'info', component: InfoComponent, data: { uid: 3000 } },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
