import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ImageService {
  private apiUrl: string = environment.apiUrl;
  constructor() {
    this.setApiUrl(environment.apiUrl);
  }

  private setApiUrl(url: string): void {
    this.apiUrl = url;
  }

  public getImageUrl(countryCode: string, imageType: 'flags' | 'plates'): string {
    return `${this.apiUrl}/api/images/${imageType}/${countryCode.toLowerCase()}.svg`;
  }
}
