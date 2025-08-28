// src/app/pages/home/components/current-time/current-time.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-current-time',
  standalone: true,
  imports: [CommonModule],
  templateUrl: `./current-time.component.html`,
  styleUrls: [`./current-time.component.scss`]
})
export class CurrentTimeComponent implements OnInit, OnDestroy {
  currentTime: string = '';
  private timeSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.updateTime();
    // Update time every second
    this.timeSubscription = interval(1000).subscribe(() => {
      this.updateTime();
    });
  }

  ngOnDestroy() {
    this.timeSubscription.unsubscribe();
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}