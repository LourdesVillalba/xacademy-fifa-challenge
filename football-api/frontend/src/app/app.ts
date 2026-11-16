import { Component, signal } from '@angular/core';
import { PlayersListComponent } from './components/players-list/players-list';

@Component({
  selector: 'app-root',
  imports: [PlayersListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
