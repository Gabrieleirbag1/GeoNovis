import { Component, OnInit, OnChanges, Input, SimpleChanges, Output, EventEmitter, AfterViewInit } from "@angular/core";

import * as L from "leaflet";
import geoJsonData from "../../../../../assets/geo/custom_countries_with_codes.geo.json";
import { GameStateService } from "../../../../services/game-state.service";
import { GameService } from "../../../../services/game.service";
import { Country } from "../../../../types/countrie.type";
import { CommonModule } from "@angular/common";
import { ConvertService } from "../../../../services/convert.service";
import { CountryCode } from "../../../../types/code.type";
import { GameSessionService } from "../../../../services/game-session.service";
import { CountryInfo } from "../../../../types/country-info.type";

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
  geoJsonData = geoJsonData as GeoJSON.FeatureCollection;
  foundCountries: CountryCode[] = [];
  countries: Country[] = [];
  selectedCountry: string = "";

  @Input() turn!: number; // new input to track round changes
  @Input() endRound!: boolean; // new input to track correct country code

  @Output() answerSelected = new EventEmitter<{ selectedCode: CountryCode; correctCode: CountryCode }>();

  constructor(private gameService: GameService, private convertService: ConvertService, private gameStateService: GameStateService, private gameSessionService: GameSessionService) {}

  ngAfterViewInit(): void {
    this.init();
    this.foundCountries = this.gameStateService.getFoundCountries();
    console.log("Found countries:", this.foundCountries);
    this.initMap();
    this.addGeoJsonLayer();
    this.initHighlightCountries();
  }

  private initHighlightCountries(): void {
    this.highlightCountriesByCode();
    if (this.endRound) {
      console.log("End of round, highlighting selected country:", this.gameService.selectedCountryCode);
      if (!this.foundCountries.includes(this.gameService.selectedCountryCode)) {
        this.foundCountries.push(this.gameService.selectedCountryCode);
      }
      this.highlightCountryByCode(this.gameService.selectedCountryCode, "green");
      this.highlightCountryByCode(this.countryCode, "purple");
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["turn"] && !changes["turn"].isFirstChange()) {
      this.init();
      console.log("Round changed, reinitializing map and highlighting countries");
      this.initHighlightCountries();
    }
    if (changes["endRound"]) {
      if (changes["endRound"].currentValue === true) {
        if (!this.foundCountries.includes(this.gameService.selectedCountryCode) && this.gameService.selectedCountryCode !== "") {
          this.foundCountries.push(this.gameService.selectedCountryCode);
        }
        console.log("Found countries after end round:", this.foundCountries, "country", this.gameService.selectedCountryCode);
        this.highlightCountryByCode(this.gameService.selectedCountryCode, "green");
        this.highlightCountryByCode(this.countryCode, "purple");
        
      } else if (changes["endRound"].currentValue === false) {
        this.geojson.eachLayer((layer: any) => {
          if (layer.feature && layer.feature.properties 
            && layer.feature.properties["code"] 
            && layer.feature.properties["code"].toLowerCase() === this.countryCode.toLowerCase()) {
            this.resetStyle(layer);
          }
        });
      }
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

  private initMap(): void {
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

  private onHover(e: L.LeafletEvent): void {
    const layer = e.target as L.Path;
    // console.log(e.target.feature.properties.code, 'hovered');
    // console.log("layer", layer);
    if (this.foundCountries.includes(e.target.feature.properties.code.toLowerCase() as CountryCode)) {
      return;
    }
    this.highlightFeature(layer, "blue");
  }

  private highlightFeature(layer: L.Path, color: string = "red"): void {
    layer.setStyle({
      weight: 5,
      color: color,
      fillColor: color,
      dashArray: "",
      fillOpacity: 0.5,
    });

    // console.log(this.geoJsonData, 'highlighted');

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  private resetHighlight(e: L.LeafletEvent): void {
    if (this.foundCountries.includes(e.target.feature.properties.code.toLowerCase() as CountryCode)) {
      // console.log("Country already found:", e.target.feature.properties.code);
      return;
    }
    this.geojson.resetStyle(e.target);
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
      mouseout: this.resetHighlight.bind(this),
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
