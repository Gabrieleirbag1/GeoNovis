import * as L from "leaflet";
import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, AfterViewInit } from "@angular/core";
import { GameStateService } from "../../../../services/game-state.service";
import { GameService } from "../../../../services/game.service";
import { Country } from "../../../../types/countrie.type";
import { CommonModule } from "@angular/common";
import { ConvertService } from "../../../../services/convert.service";
import { CountryCode } from "../../../../types/code.type";
import { CountryInfo } from "../../../../types/country-info.type";
import { ApiService } from "../../../../services/api.service";

@Component({
  selector: "app-map",
  imports: [CommonModule],
  standalone: true,
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements AfterViewInit, OnChanges {
  private map!: L.Map;
  private geojson!: L.GeoJSON;
  geoJsonData: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: [] };
  foundCountries: CountryCode[] = [];
  countries: Country[] = [];
  selectedCountry: string = "";

  @Input() turn!: number; // new input to track round changes
  @Input() endRound!: boolean; // new input to track correct country code
  @Input() countryCode!: CountryCode; // new input to track selected country code

  @Output() answerSelected = new EventEmitter<{ selectedCode: CountryCode; correctCode: CountryCode }>();

  constructor(private gameService: GameService, 
    private convertService: ConvertService, 
    private gameStateService: GameStateService, 
    private apiService: ApiService) {
    }

  ngAfterViewInit(): void {
    this.init();
    this.foundCountries = this.gameStateService.getFoundCountries();
    console.log("Found countries:", this.foundCountries);
    this.initializeMap();
  }

  private initializeMap(): void {
    this.loadGeoJsonData().then(() => {
      this.setupMap();
      this.addGeoJsonLayer();
      this.initHighlightCountries();
    }).catch((error) => { 
      console.error("Error loading GeoJSON data:", error);
    });
  }

  private loadGeoJsonData(): Promise<void> {
    console.log("Loading GeoJSON data...");
    return new Promise<void>((resolve, reject) => {
      this.apiService.getGeoJson("world").subscribe({
        next: (data: GeoJSON.FeatureCollection) => {
          this.geoJsonData = data;
          resolve();
        },
        error: (error) => {
          console.error("Error loading GeoJSON data:", error);
          reject(error);
        }
      });
    });
  }

  private initHighlightCountries(): void {
    this.highlightCountriesByCode();
    if (this.endRound) {
      if (!this.foundCountries.includes(this.gameService.selectedCountryCode)) {
        this.foundCountries.push(this.gameService.selectedCountryCode);
      }
      this.highlightCountryByCode(this.countryCode, "red");
      this.highlightCountryByCode(this.gameService.selectedCountryCode, "green");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["turn"]) {
      this.handleTurnChange(changes);
    }
    if (changes["endRound"]) {
      this.handleEndRoundChange(changes);
    }
  }

  private handleTurnChange(changes: SimpleChanges): void {
    if (!changes["turn"].isFirstChange()) {
      this.init();
      this.initHighlightCountries();
    }
  }

  private handleEndRoundChange(changes: SimpleChanges): void {
    if (changes["endRound"].currentValue === true) {
      if (!this.foundCountries.includes(this.gameService.selectedCountryCode) && this.gameService.selectedCountryCode !== "") {
        this.foundCountries.push(this.gameService.selectedCountryCode);
      }
      console.log("Found countries after end round:", this.foundCountries, "country", this.gameService.selectedCountryCode);
      this.highlightCountryByCode(this.countryCode, "red");
      this.highlightCountryByCode(this.gameService.selectedCountryCode, "green");
    } else if (changes["endRound"].currentValue === false) {
      this.geojson.eachLayer((layer: any) => {
        if (layer.feature && layer.feature.properties 
          && layer.feature.properties["code"] 
          && layer.feature.properties["code"].toLowerCase() === this.countryCode.toLowerCase()) {
            if (!this.foundCountries.includes(this.countryCode)) {
              this.resetHighlighted(layer);
            }
        }
      });
    }
  }

  onAnswerSelect(countryCode: CountryCode): void {
    this.answerSelected.emit({
      selectedCode: countryCode,
      correctCode: this.gameService.selectedCountryCode,
    });
    this.foundCountries.push(this.gameService.selectedCountryCode);
  }

  init(): void {
    // console.log('FindCapital Component Initialized');
    this.gameService.initializeGame(1);
    this.countries = this.gameService.getCountries();
    const countryInfo: CountryInfo | null = this.convertService.convertCodeToCountry(this.gameService.selectedCountryCode);
    this.selectedCountry = countryInfo?.country[this.convertService.language] || "";
  }

  private setupMap(): void {
    this.map = L.map("map", {
      center: [39.8282, -98.5795],
      zoom: 2,
    });

    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    const tiles = L.tileLayer("http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png", {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    this.map.addLayer(tiles);
    this.map.setMaxBounds(
      L.latLngBounds([
        [-90, -180],
        [90, 180],
      ])
    );
  }

  public highlightCountriesByCode(): void {
    // Make sure geojson is initialized
    if (!this.geojson) {
      console.warn("GeoJSON layer not initialized yet");
      return;
    }

    // Process found countries
    this.foundCountries.forEach((countryCode) => {
      this.highlightCountryByCode(countryCode, "darkgray");
    });
  }

  public highlightCountryByCode(countryCode: CountryCode, color: string = "red"): void {
    this.geojson.eachLayer((layer: any) => {
      // Check if this layer's feature matches our country code
      if (layer.feature && layer.feature.properties 
        && layer.feature.properties["code"] 
        && layer.feature.properties["code"].toLowerCase() === countryCode.toLowerCase()) {
        this.highlightFeature(layer, color);
      }
    });
  }

  private style(): L.PathOptions {
    return {
      fillColor: "#b4caed",
      weight: 0.75,
      opacity: 1,
      color: "black",
      fillOpacity: 0.4,
    };
  }

  private canHandleCountryHighlight(countryCode: CountryCode): boolean {
    if (this.foundCountries.includes(countryCode.toLowerCase() as CountryCode)) {
      return false;
    } else if (countryCode.toLowerCase() === this.countryCode.toLowerCase()) {
      return false;
    }
    return true;
  }

  private onHover(e: L.LeafletEvent): void {
    if (!this.canHandleCountryHighlight(e.target.feature.properties.code.toLowerCase() as CountryCode)) {
      return;
    }
    const layer = e.target as L.Path;
    this.highlightFeature(layer, "blue");
  }

  private onMouseOut(e: L.LeafletEvent): void {
    if (!this.canHandleCountryHighlight(e.target.feature.properties.code.toLowerCase() as CountryCode)) {
      return;
    }
    this.resetHighlighted(e.target as L.Path);
  }

  private resetHighlighted(layer: L.Path): void {
    this.geojson.resetStyle(layer);
  }

  private highlightFeature(layer: L.Path, color: string = "red"): void {
    layer.setStyle({
      weight: 5,
      color: color,
      fillColor: color,
      dashArray: "",
      fillOpacity: 0.5,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  private focusOnFeature(e: any) {
    // this.map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
    const countryCode = e.target.feature.properties.code.toLowerCase() as CountryCode;
    console.log("Country code clicked:", e.target.feature.properties.name);
    this.onAnswerSelect(countryCode);
  }

  private onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer): void => {
    layer.on({
      mouseover: this.onHover.bind(this),
      mouseout: this.onMouseOut.bind(this),
      click: this.focusOnFeature.bind(this),
    });
  };

  private addGeoJsonLayer(): void {
    this.geojson = L.geoJSON(this.geoJsonData, {
      style: this.style.bind(this),
      onEachFeature: this.onEachFeature,
    }).addTo(this.map);
  }
}
