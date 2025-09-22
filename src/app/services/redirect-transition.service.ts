import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RedirectTransitionService {
  private isTransitioning: boolean = false;
  private transitioningSubject = new BehaviorSubject<boolean>(false);

  // NEW: expose transition phase
  private phaseSubject = new BehaviorSubject<TransitionPhase>('idle');
  private timers: number[] = [];

  constructor(private routes: Router) {}

  // Backward compatible method (defaults)
  redirectTo(route: string) {
    this.redirectWithPhases(route, { preMs: 350, travelMs: 900, postMs: 350 });
  }

  // NEW: Orchestrated phases
  redirectWithPhases(
    route: string,
    opts: { preMs?: number; travelMs?: number; postMs?: number } = {}
  ) {
    const preMs = opts.preMs ?? 350;
    const travelMs = opts.travelMs ?? 900;
    const postMs = opts.postMs ?? 350;

    this.clearTimers();

    // Begin
    this.setTransitioning(true);
    this.setPhase('pre');

    this.timers.push(
      window.setTimeout(() => {
        this.setPhase('travel');

        this.timers.push(
          window.setTimeout(async () => {
            try {
              await this.routes.navigate([`/${route}`]);
            } finally {
              // After navigation, fade out
              this.setPhase('post');
              this.timers.push(
                window.setTimeout(() => {
                  this.setPhase('idle');
                  this.setTransitioning(false);
                }, postMs)
              );
            }
          }, travelMs)
        );
      }, preMs)
    );
  }

  private setPhase(phase: TransitionPhase) {
    this.phaseSubject.next(phase);
  }

  getPhaseState(): Observable<TransitionPhase> {
    return this.phaseSubject.asObservable();
  }

  setTransitioning(state: boolean) {
    this.isTransitioning = state;
    this.transitioningSubject.next(state);
  }

  getTransitioning(): boolean {
    return this.isTransitioning;
  }

  getTransitionState(): Observable<boolean> {
    return this.transitioningSubject.asObservable();
  }

  private clearTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }
}