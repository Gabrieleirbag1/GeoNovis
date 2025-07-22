import { Component } from '@angular/core';
import gameRule from '../../../../assets/data/game.json';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-rules',
  imports: [CommonModule, FormsModule],
  templateUrl: './rules.html',
  styleUrl: './rules.css'
})
export class Rules {
  gameRules: any = gameRule;
}
