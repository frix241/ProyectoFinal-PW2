import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurante-panel',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './restaurante-panel.html',
  styleUrls: ['./restaurante-panel.css']
})
export class RestaurantePanelComponent {
  nombreRestaurante: string = '';
}
