import { Component, ElementRef, ViewChild, Renderer2, OnInit, OnDestroy, HostListener } from '@angular/core';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';
import { ConvertService } from '../../services/convert.service';
import { LanguageService } from '../../services/language.service';
import { AssetsService } from '../../services/assets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endgame',
  imports: [CommonModule],
  templateUrl: './endgame.component.html',
  styleUrls: ['./endgame.component.css']
})
export class EndgameComponent implements OnInit, OnDestroy {
  protected results: {"gameState": any[], "countryInfo": any[]} = {"gameState": [], "countryInfo": []};
  protected roundsCompleted: number = 0;
  protected score: number = 0;
  protected language: string = 'fr';
  
  @ViewChild('tooltipImage') tooltipImage!: ElementRef;
  @ViewChild('endGameContainer') endGameContainer!: ElementRef;
  private tooltipTimeout: any;
  private touchStartTarget: EventTarget | null = null;

  constructor(
    private gameSessionService: GameSessionService,
    private convertService: ConvertService,
    private languageService: LanguageService,
    protected assetsService: AssetsService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.language = this.languageService.getLanguage();
    this.setResults();
    this.setScore();
    
    // Add touch start listener to the endgame container
    document.addEventListener('touchstart', this.handleTouchStart.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }
  
  ngOnDestroy(): void {
    // Clear any active timeouts when component is destroyed
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    
    // Remove touch listeners
    document.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    document.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    
    // Ensure dragging class is removed
    document.body.classList.remove('dragging');
  }

  private handleTouchStart(event: TouchEvent): void {
    // Store the target element for later comparison
    this.touchStartTarget = event.target;
    
    // Check if the touch started in the end-game container or any of its children
    if (this.isEndGameElement(event.target as Element)) {
      document.body.classList.add('dragging');
    }
  }
  
  private handleTouchEnd(event: TouchEvent): void {
    // Check if we're ending a touch that didn't start in end-game
    if (!this.isEndGameElement(this.touchStartTarget as Element)) {
      document.body.classList.remove('dragging');
    }
    
    this.touchStartTarget = null;
  }
  
  // Helper to check if an element is part of the end-game component
  private isEndGameElement(element: Element | null): boolean {
    if (!element) return false;
    
    let current: Element | null = element;
    
    while (current) {
      if (current.classList && current.classList.contains('end-game')) {
        return true;
      }
      current = current.parentElement;
    }
    
    return false;
  }

  private setResults(): void {
    const gameState = this.gameSessionService.getGameState();
    for (const key in gameState) {
      if (gameState[key].hasOwnProperty('score') && gameState[key].found !== null) {
        gameState[key].score = this.updateBestScore(gameState[key].score);
        this.results.gameState.push(gameState[key]);
        this.results.countryInfo.push(this.convertService.convertCodeToCountry(gameState[key].code));
        this.roundsCompleted++;
      }
    }
  }

  private updateBestScore(currentScore: number): number {
    const gameSave = this.gameSessionService.getParsedItem("gameSave") || {};
    const subgamemodes = gameSave.subgamemode.available || [];
    const score = currentScore / subgamemodes.length;
    return score;
  }

  private setScore(): number {
    this.results.gameState.forEach(result => {
      if (result.score) {
        this.score += result.score;
      }
    });
    return this.score;
  }

  protected goToHome(): void {
    this.router.navigate(['/home']);
  }

  protected showRules(): void {
    this.router.navigate(['/rules']);
  }
  
  // Image tooltip functionality
  showImageTooltip(event: MouseEvent, imageSrc: string): void {
    // Clear any existing timeout
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
    }
    
    // Set timeout for 1.25 seconds
    this.tooltipTimeout = setTimeout(() => {
      const tooltipEl = document.getElementById('tooltipImage');
      if (tooltipEl) {
        const imgEl = tooltipEl.querySelector('img') as HTMLImageElement;
        imgEl.src = imageSrc;
        
        // Position the tooltip
        this.positionTooltip(event, tooltipEl);
        
        // Show the tooltip
        this.renderer.addClass(tooltipEl, 'visible');
      }
    }, 1250); // 1.25 seconds
  }
  
  hideImageTooltip(): void {
    // Clear timeout
    if (this.tooltipTimeout) {
      clearTimeout(this.tooltipTimeout);
      this.tooltipTimeout = null;
    }
    
    // Hide the tooltip
    const tooltipEl = document.getElementById('tooltipImage');
    if (tooltipEl) {
      this.renderer.removeClass(tooltipEl, 'visible');
    }
  }
  
  private positionTooltip(event: MouseEvent, tooltipEl: HTMLElement): void {
    // Calculate position - try to center above the cursor
    const tooltipWidth = tooltipEl.offsetWidth;
    const tooltipHeight = tooltipEl.offsetHeight;
    
    let leftPos = event.clientX - (tooltipWidth / 2);
    let topPos = event.clientY - tooltipHeight - 15;
    
    // Keep tooltip within viewport bounds
    if (leftPos < 10) leftPos = 10;
    if (leftPos + tooltipWidth > window.innerWidth - 10) {
      leftPos = window.innerWidth - tooltipWidth - 10;
    }
    
    // If tooltip would appear above viewport, place it below cursor instead
    if (topPos < 10) {
      topPos = event.clientY + 15;
    }
    
    this.renderer.setStyle(tooltipEl, 'left', `${leftPos}px`);
    this.renderer.setStyle(tooltipEl, 'top', `${topPos}px`);
  }

  protected getRowClass(score: number): string {
    if (score >= 1) {
      return 'row-correct';
    } else if (score >= 0.5) {
      return 'row-partial';
    } else {
      return 'row-incorrect';
    }
  }
  
  protected getStatusClass(score: number): string {
    if (score >= 1) {
      return 'status-correct';
    } else if (score >= 0.5) {
      return 'status-partial';
    } else {
      return 'status-incorrect';
    }
  }
  
  // Add a click handler to remove dragging class when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isEndGameElement(event.target as Element)) {
      document.body.classList.remove('dragging');
    }
  }
}
