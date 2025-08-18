import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import geoJsonData from '../../../../../assets/geo/countries_with_codes.geo.json';
import { CountryCode } from '../../../../types/code.type';
import { GameStateService } from '../../../../services/game-state.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private geojson!: L.GeoJSON;
  geoJsonData = geoJsonData as GeoJSON.FeatureCollection;
  foundCountries: CountryCode[] = [];

  constructor(private gameStateService: GameStateService) { }

  ngAfterViewInit(): void {
    this.foundCountries = this.gameStateService.getFoundCountries();
    console.log('Found countries:', this.foundCountries);
    this.highlightCountry(this.gameStateService.selectedCountryCode);
    this.initMap();
    this.addGeoJsonLayer();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 2
    });

    // https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
    const tiles = L.tileLayer('http://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    this.map.addLayer(tiles);
    this.map.setMaxBounds(L.latLngBounds([[-90, -180], [90, 180]]));
  }

  private style(): L.PathOptions {
    return {
      fillColor: '#b4caed',
      weight: 0.75,
      opacity: 1,
      color: 'black',
      fillOpacity: 0.4
    };
  }

  private highlightFeature(e: L.LeafletEvent): void {
    const layer = e.target as L.Path;
    console.log('Highlighting feature:', layer);
    layer.setStyle({
      weight: 5,
      color: 'red',
      fillColor: 'red',
      dashArray: '',
      fillOpacity: 0.5
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  }

  public highlightCountry(code: string): boolean {
    let found = false;
    
    
    return found;
  }

  private resetHighlight(e: L.LeafletEvent): void {
    if (!this.foundCountries.includes(e.target.feature.properties.code)) {
      this.geojson.resetStyle(e.target);
    }
  }

  private zoomToFeature(e: any) {
    // this.map.fitBounds(e.target.getBounds(), { padding: [50, 50] });
    console.log('Zoomed to feature:', e.target.feature.properties.code);
    this.highlightFeature(e);
  }

  private onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer): void => {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlight.bind(this),
      click: this.zoomToFeature.bind(this)
    });
  }

  private addGeoJsonLayer(): void {
    this.geojson = L.geoJSON(this.geoJsonData, {
      style: this.style.bind(this),
      onEachFeature: this.onEachFeature
    }).addTo(this.map);
  }
}