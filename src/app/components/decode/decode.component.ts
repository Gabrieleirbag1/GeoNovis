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
  decodedSessionData: Record<string, string> = {};
  constructor(private apiService: ApiService, private sessionService: GameSessionService) { }

  ngOnInit(): void {
    const encodedSessionData = this.getQueryParams();
    if (encodedSessionData) {
      this.decodeSessionData(encodedSessionData).then(() => {
        this.sessionService.setGameSessionData(this.decodedSessionData).then(() => {
          window.location.href = '/';
        });
      })
      .catch((error) => {
        console.error('Error decoding session data:', error);
      });
    } else {
      window.location.href = '/';
    }
  }

  private getQueryParams(): string | null {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionData = queryParams.get('sessionData');
    return sessionData;
  }

  private decodeSessionData(encodedSessionData: string): Promise<void> {
    console.log('Encoded data:', encodedSessionData);
    const jsonSessionData = { sessionData: encodedSessionData }
    return new Promise<void>((resolve, reject) => {
    this.apiService.postSessionDataToDecode(jsonSessionData).subscribe({
      next: (response) => {
        console.log('Session data posted successfully:', response);
        this.decodedSessionData = response.content || 'No content returned';
        resolve();
      },
      error: (error) => {
        console.error('Error posting session data:', error);
        this.decodedSessionData = {};
        reject(error);
      }
    });
  });
  }

}
