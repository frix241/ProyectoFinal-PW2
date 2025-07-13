import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-restaurante-panel',
  imports: [FormsModule],
  templateUrl: './restaurante-panel.html',
  styleUrl: './restaurante-panel.css'
})
export class RestaurantePanel {
  nombreRestaurante: string = '';
}
