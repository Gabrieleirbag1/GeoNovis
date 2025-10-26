import { AfterViewInit, Component, NgZone, OnInit, signal } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoadingService } from './services/loading.service';
import { filter, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, LoaderComponent, AsyncPipe, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  protected readonly title = signal('GeoNovis');

  constructor(
    private loadingService: LoadingService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  loading$?: Observable<boolean>;
  contentLoaded = false;
  navigationLoaded = false;

  ngOnInit(): void {
    this.loading$ = this.loadingService.isLoading$;
    if (document.readyState === 'complete') {
      this.contentLoaded = true;
      this.checkAllLoaded();
    } else {
      window.addEventListener('load', () => {
        this.ngZone.run(() => {
          this.contentLoaded = true;
          this.checkAllLoaded();
        });
      });
    }

    // Handle navigation events
    this.router.events.pipe(
      filter(event => 
        event instanceof NavigationStart ||
        event instanceof NavigationEnd || 
        event instanceof NavigationCancel || 
        event instanceof NavigationError
      )
    ).subscribe(event => {
      if (event instanceof NavigationStart) {
        // Check if navigating to rules component
        const targetUrl = event.url;
        const isNavigatingToRules = targetUrl.includes('/rules');
        const isMenuNavigation = this.isMenuToMenuNavigation(targetUrl);
        
        if (isNavigatingToRules) {
          // Always show loader for rules
          this.loadingService.forceShowLoader();
        } else if (isMenuNavigation) {
          // Skip loader for menu-to-menu transitions
          this.loadingService.skipNextLoader();
        }
        
        // Call showLoader which will respect the skipNextLoader setting
        this.loadingService.showLoader();
        this.navigationLoaded = false;
      } else {
        // Small delay to allow view to render
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200);
      }
    });
  }

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200);
      });
    });
  }

  private checkAllLoaded(): void {
    if (this.contentLoaded && this.navigationLoaded) {
      this.loadingService.hideLoader();
    }
  }
  
  // Helper method to determine if this is a menu-to-menu navigation
  private isMenuToMenuNavigation(targetUrl: string): boolean {
    const currentUrl = this.router.url;
    const menuRoutes = ['region', 'gamemode', 'subgamemode', 'difficulty'];
    
    const currentIsMenu = menuRoutes.some(route => currentUrl.includes(route)) || currentUrl === '/';
    const targetIsMenu = menuRoutes.some(route => targetUrl.includes(route)) || targetUrl === '/';
    
    return currentIsMenu && targetIsMenu;
  }
}