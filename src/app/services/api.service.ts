import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor() {}

  // Add other API methods as needed
  getApiUrl(): string {
    return this.apiUrl;
  }
}