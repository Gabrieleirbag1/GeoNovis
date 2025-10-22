import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingGuard implements CanActivate {
  constructor(
    private loadingService: LoadingService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    this.loadingService.showLoader();
    return true;
  }
}