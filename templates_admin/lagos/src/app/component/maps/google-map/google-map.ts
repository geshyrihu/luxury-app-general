import { Component } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';

interface IMarkerPosition {
  lat: number;
  lng: number;
}

interface IMarkerLabel {
  color: string;
  text: string;
}

interface IGoogleMapMarkers {
  position: IMarkerPosition;
  label: IMarkerLabel;
}

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.html',
  styleUrls: ['./google-map.scss'],
  imports: [GoogleMap, MapMarker],
})
export class GoogleMaps {
  public asiaMapOptions: google.maps.MapOptions = {
    center: { lat: 47.5162, lng: 100.2167 },
    zoom: 3,
  };

  public worldMapOption: google.maps.MapOptions = {
    center: { lat: 0, lng: 0 },
    zoom: 2,
  };

  public usaMapOptions: google.maps.MapOptions = {
    center: { lat: 37.0902, lng: -95.7129 },
    zoom: 4,
  };

  public indiaMapOptions: google.maps.MapOptions = {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 4,
  };

  public markers: IGoogleMapMarkers[];
  public zoom: number;

  constructor() {
    this.markers = [];

    this.markers.push({
      position: {
        lat: 32.4279,
        lng: 53.688,
      },
      label: {
        color: 'black',
        text: 'Iran',
      },
    });

    this.markers.push({
      position: {
        lat: 33.9391,
        lng: 67.71,
      },
      label: {
        color: 'black',
        text: 'Afghanistan',
      },
    });

    this.markers.push({
      position: {
        lat: 23.0225,
        lng: 72.5714,
      },
      label: {
        color: 'black',
        text: 'Ahmadabad',
      },
    });
  }
}
