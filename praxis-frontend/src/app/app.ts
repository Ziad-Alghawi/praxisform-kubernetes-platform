import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConsentOverlayComponent } from './shared/consent-overlay/consent-overlay.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ConsentOverlayComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('praxis-frontend');
}
