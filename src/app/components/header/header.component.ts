import { Component } from "@angular/core";
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

  constructor(private languageService: LanguageService, private apiService: ApiService) {
    this.currentLanguage = this.languageService.getLanguage();
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
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
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
    navigator.clipboard.writeText(shareableLink)
  }

  openQrModal(): void {
    this.getAllSessionStorage().then(() => {
      this.showQrModal = true;
    });
  }

  closeQrModal(): void {
    this.showQrModal = false;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public redirect(route: string): void {
    this.toggleSidebar();
    setTimeout(() => {
      this.navigateToRoute(route);
    }, 300); // Match the duration of the sidebar transition
  }

  private navigateToRoute(route: string): void {
    window.location.href = route;
  }
}
