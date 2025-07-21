import { Component } from '@angular/core';
import { FindCapital } from "../capitals/find-capital/find-capital";

@Component({
  selector: 'app-game',
  imports: [FindCapital],
  templateUrl: './game.html',
  styleUrl: './game.css'
})
export class Game {

}
