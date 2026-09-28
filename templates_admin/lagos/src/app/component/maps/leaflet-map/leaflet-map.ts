import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';

import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { GeoJsonObject } from 'geojson';
import * as L from 'leaflet';

@Component({
  selector: 'app-leaflet-map',
  templateUrl: './leaflet-map.html',
  styleUrls: ['./leaflet-map.scss'],
  imports: [LeafletModule],
})
export class LeafletMap {
  private http = inject(HttpClient);

  //First map options
  options1 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: L.latLng(46.879966, -121.726909),
  };

  layersControl = {
    baseLayers: {
      'Open Street Map': L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
      'Open Cycle Map': L.tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    },
    overlays: {
      'Big Circle': L.circle([46.95, -122], { radius: 5000 }),
      'Big Square': L.polygon([
        [46.8, -121.55],
        [46.9, -121.55],
        [46.9, -121.7],
        [46.8, -121.7],
      ]),
    },
  };

  //Second map
  options2 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 50,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: L.latLng(46.879966, -121.726909),
  };

  //Third map
  map: L.Map;
  json: GeoJsonObject | GeoJsonObject[] | null | undefined;
  options3 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '',
      }),
    ],
    zoom: 7,
    center: L.latLng(47.482019, -1),
  };
  onMapReady(map: L.Map) {
    this.http.get<GeoJsonObject>('assets/data/map/polygon.json').subscribe(json => {
      this.json = json;
      L.geoJSON(this.json).addTo(map);
    });
  }

  //Forth map
  map4: L.Map | L.LayerGroup<number>;
  homeCoords = {
    lat: 23.810331,
    lon: 90.412521,
  };

  popupText = 'Some popup text';

  markerIcon = {
    icon: L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      // specify the path here
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    }),
  };

  options4 = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '',
      }),
    ],
    zoom: 5,
    center: L.latLng(this.homeCoords.lat, this.homeCoords.lon),
  };

  initMarkers() {
    const popupInfo = `<b style="color: red; background-color: white">${this.popupText}</b>`;
    L.marker([this.homeCoords.lat, this.homeCoords.lon], this.markerIcon)
      .addTo(this.map4)
      .bindPopup(popupInfo);
  }

  onMapReady4(map: L.Map) {
    this.map4 = map;
    this.initMarkers();
  }
}
