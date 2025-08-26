import { Component, computed, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { SettingsService } from '../../core/settings.service';
import { CurrentTimeComponent } from '../../pages/home/components/current-time/current-time.component';


@Component({
selector: 'app-topbar',
standalone: true,
imports: [CommonModule, NgOptimizedImage, MatToolbarModule, MatIconModule, MatMenuModule,MatButtonModule, MatSlideToggleModule, MatListModule, CurrentTimeComponent],
templateUrl:'./topbar.component.html',
styleUrls:['./topbar.component.scss'],

})

export class TopbarComponent {
private settings = inject(SettingsService);
username = this.settings.username;
avatar = this.settings.avatarUrl;
theme = this.settings.theme;
unit = this.settings.unit;


toggleTheme(){ this.settings.toggleTheme(); }
toggleUnit(){ this.settings.toggleUnit(); }
editProfile(){
// For now, a simple prompt. Replace with a proper dialog later.
const name = prompt('New username', this.username());
const url = prompt('Avatar URL', this.avatar());
if(name && url){ this.settings.updateProfile(name, url); }
}
}