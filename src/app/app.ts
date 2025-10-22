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
        this.loadingService.showLoader();
        this.navigationLoaded = false;
      } else {
        // Small delay to allow view to render
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200); // Short delay for DOM to render
      }
    });
  }

  ngAfterViewInit(): void {
    // Use requestAnimationFrame to detect when everything is rendered
    requestAnimationFrame(() => {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.navigationLoaded = true;
          this.checkAllLoaded();
        }, 200); // Small delay to ensure everything is rendered
      });
    });
  }

  private checkAllLoaded(): void {
    if (this.contentLoaded && this.navigationLoaded) {
      this.loadingService.hideLoader();
    }
  }
}
