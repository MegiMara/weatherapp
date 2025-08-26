import { Component, DestroyRef, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
selector: 'app-current-time',
standalone: true,
imports: [CommonModule],
templateUrl:'./current-time.component.html',
styleUrls: ['./current-time.component.scss'],

})
export class CurrentTimeComponent {
now = signal(new Date());
private timer?: number;
constructor(){
this.timer = window.setInterval(() => this.now.set(new Date()), 1000 * 60);
}
ngOnDestroy(){ if(this.timer) window.clearInterval(this.timer); }
}