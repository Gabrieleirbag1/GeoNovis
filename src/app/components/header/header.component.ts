import { Component, HostListener, ElementRef, ViewChild, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { LanguageService } from "../../services/language.service";
import { Language } from "../../types/language.type";
import { QRCodeComponent } from "angularx-qrcode";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule, QRCodeComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class Header {
  currentLanguage: Language;
  showQrModal = false;
  strSessionData: string = "";
  isSidebarOpen = false;
  copied = false;
  private copyTimeout: any;
  
  // Touch handling variables
  private touchStartX: number = 0;
  private touchEndX: number = 0;
  private touchStartY: number = 0;
  private touchEndY: number = 0;
  private minSwipeDistance: number = 80; // Minimum distance for a swipe
  private maxVerticalOffset: number = 100; // Maximum vertical movement allowed for horizontal swipe

  @ViewChild('swipeArea') swipeArea!: ElementRef;
  
  constructor(
    private languageService: LanguageService, 
    private apiService: ApiService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.currentLanguage = this.languageService.getLanguage();
  }

  ngAfterViewInit() {
    // Add touch event listeners to the document body
    this.setupTouchListeners();
  }

  ngOnDestroy() {
    // Clean up by removing the event listeners if component is destroyed
    document.body.removeEventListener('touchstart', this.handleTouchStart);
    document.body.removeEventListener('touchend', this.handleTouchEnd);
  }

  private setupTouchListeners() {
    // Using bind to maintain the correct 'this' context
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    document.body.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    document.body.addEventListener('touchend', this.handleTouchEnd, { passive: true });
  }
  
  private handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }
  
  private handleTouchEnd(event: TouchEvent) {
    if (document.body.classList.contains('leaflet-dragging')) {
      return;
    }
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    
    // Calculate horizontal and vertical distances
    const horizontalDistance = this.touchStartX - this.touchEndX;
    const verticalDistance = Math.abs(this.touchStartY - this.touchEndY);
    
    // Check if the gesture was a horizontal swipe with minimal vertical movement
    if (horizontalDistance > this.minSwipeDistance && verticalDistance < this.maxVerticalOffset) {
      // Right to left swipe - open sidebar
      if (!this.isSidebarOpen && this.touchStartX > window.innerWidth * 0.9) {
        this.openSidebar();
      }
    } else if (horizontalDistance < -this.minSwipeDistance && verticalDistance < this.maxVerticalOffset) {
      // Left to right swipe - close sidebar if it's open
      if (this.isSidebarOpen) {
        this.closeSidebar();
      }
    }
  }

  openSidebar(): void {
    this.isSidebarOpen = true;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  selectLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.currentLanguage = language;
    // Reload the page to reflect language changes
    window.location.reload();
  }

  getAllSessionStorage(): Promise<void> {
    const sessionData: Record<string, string> = {};

    // Collect all session storage items into an object
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          sessionData[key] = value;
        }
      }
    }

    return new Promise<void>((resolve, reject) => {
      this.apiService.postSessionDataToEncode(sessionData).subscribe({
        next: (response) => {
          console.log("Session data posted successfully:", response);
          const rootUrl = window.location.origin;
          console.log("Root URL:", rootUrl);
          this.strSessionData = `${rootUrl}/decode?sessionData=${response.content}`;
          resolve();
        },
        error: (error) => {
          console.error("Error posting session data:", error);
          this.strSessionData = "Error generating QR code data";
          reject(error);
        },
      });
    });
  }

  shareSessionLink(): void {
    const shareableLink = this.strSessionData;
    navigator.clipboard.writeText(shareableLink).then(() => {
      // Show "Copied!" feedback
      this.copied = true;
      
      // Reset after 3 seconds
      if (this.copyTimeout) {
        clearTimeout(this.copyTimeout);
      }
      
      this.copyTimeout = setTimeout(() => {
        this.copied = false;
      }, 3000);
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  }

  openQrModal(): void {
    this.getAllSessionStorage().then(() => {
      this.showQrModal = true;
    });
  }

  closeQrModal(): void {
    this.showQrModal = false;
    this.copied = false; // Reset copied state when closing
    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.showQrModal) {
      this.closeQrModal();
    } else if (this.isSidebarOpen) {
      this.closeSidebar();
    }
  }

  public redirect(route: string, newTab: boolean = false): void {
    this.closeSidebar();
    setTimeout(() => {
      this.navigateToRoute(route, newTab);
    }, 300); // Match the duration of the sidebar transition
  }

  private navigateToRoute(route: string, newTab: boolean): void {
    if (newTab) {
      window.open(route, '_blank');
    } else {
      window.location.href = route;
    }
  }
}
