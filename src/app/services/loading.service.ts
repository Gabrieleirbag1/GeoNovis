import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(true);
  isLoading$ = this.isLoadingSubject.asObservable();
  
  // Track if we should skip showing loader for transitions
  private skipLoaderForTransition = false;

  showLoader(): void {
    if (!this.skipLoaderForTransition) {
      this.isLoadingSubject.next(true);
    }
  }

  hideLoader(): void {
    this.isLoadingSubject.next(false);
    this.skipLoaderForTransition = false; // Reset after hiding
  }
  
  forceShowLoader(): void {
    this.isLoadingSubject.next(true);
  }
  
  skipNextLoader(): void {
    this.skipLoaderForTransition = true;
  }
}