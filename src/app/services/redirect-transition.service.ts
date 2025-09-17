import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectTransitionService {
  private isTransitioning: boolean = false;
  private transitioningSubject = new BehaviorSubject<boolean>(false);

  constructor(private routes: Router) {}

  redirectTo(route: string) {
    this.setTransitioning(true);
    setTimeout(() => {
      this.routes.navigate([`/${route}`]);
      this.setTransitioning(false);
    }, 1000);
  }

  setTransitioning(state: boolean) {
    this.isTransitioning = state;
    this.transitioningSubject.next(state);
  }

  getTransitioning(): boolean {
    return this.isTransitioning;
  }

  // Add observable to listen for transition state changes
  getTransitionState(): Observable<boolean> {
    return this.transitioningSubject.asObservable();
  }
}