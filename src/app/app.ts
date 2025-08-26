import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/* import { LoginComponent } from './pages/login/login.component';*/
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  protected readonly title = signal('weatherapp');
}
