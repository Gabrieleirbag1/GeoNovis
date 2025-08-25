import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getGeoJson(region: string): Observable<GeoJSON.FeatureCollection> {
    console.log(`Fetching GeoJSON data for region: ${region}`);
    return this.http.get<GeoJSON.FeatureCollection>(`${this.apiUrl}/api/geojson/${region}`);
  }

  getGeoCodes(regions: string[]): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/geocodes/?regions=${regions.join(",")}`);
  }
  
  getApiUrl(): string {
    return this.apiUrl;
  }
}