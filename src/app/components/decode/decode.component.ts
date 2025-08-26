import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { GameSessionService } from '../../services/game-session.service';

@Component({
  selector: 'app-decode',
  standalone: true,
  imports: [],
  templateUrl: './decode.component.html',
  styleUrl: './decode.component.css'
})
export class DecodeComponent implements OnInit {
  decodedSessionData: string = '';
  constructor(private apiService: ApiService, private sessionService: GameSessionService) { }

  ngOnInit(): void {
    const encodedSessionData = this.getQueryParams();
    if (encodedSessionData) {
      this.decodeSessionData(encodedSessionData);
      this.sessionService.setGameSessionData(this.decodedSessionData);
    } else {
      // dont redirect on this page
      window.location.href = '/';
    }
  }

  private getQueryParams(): string | null {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionData = queryParams.get('sessionData');
    return sessionData;
  }

  private decodeSessionData(encodedSessionData: string): void {
    console.log('Encoded data:', encodedSessionData);
    const jsonSessionData = { sessionData: encodedSessionData }
    this.apiService.postSessionDataToDecode(jsonSessionData).subscribe({
      next: (response) => {
        console.log('Session data posted successfully:', response);
        this.decodedSessionData = response.content || 'No content returned';
      },
      error: (error) => {
        console.error('Error posting session data:', error);
        this.decodedSessionData = 'Error generating QR code data';
      }
    });
  }

}
