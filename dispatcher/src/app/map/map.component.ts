import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { Responder } from '../classes';
import { Emergency } from '../classes';
import { ShareFormService } from '../share-form.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MapService]
})
export class MapComponent implements OnInit {
  title: string = 'Doctors within Borders';
  lat: number = 43.6595053;
  lng: number = -79.3978192;
  zoom: number = 14;
  responders: Responder[];
  haveEmergency: boolean;
  emergency: Emergency;

    getEmergency(): Emergency {

        return this.shareFormService.sharedata();

    }

  constructor(private mapService: MapService,
              private shareFormService: ShareFormService) {
  }

  ngOnInit() {
    this.responders = this.mapService.getResponders();
    this.haveEmergency = true;
    this.emergency = this.getEmergency();
    if (this.haveEmergency) {

    }
  }

  getResponderIcon(responder: Responder) {
    let path = '../../assets/';
    switch (responder.skills.length) {
      case 1:
        return path + 'cpr.png';
      case 2:
        return path + 'firstaid.png';
      case 3:
        return path + 'medkit.png';
      default:
        return path + 'medkit.png';
    }
  }

  emergencyClick(emergency: Emergency) {
    this.mapStartEmergency(emergency);
  }

  getEmergencyIcon(emergency: Emergency) {
    return '../../assets/emergency.png'
  }

  mapStartEmergency(em: Emergency): void {

    this.mapService.startEmergency(em).then(
      response => {
        console.log("in map component");
        console.log(response);
      }
    )

    let closest = this.findClosestResponder(em);
    console.log("Closest responder: " + closest['responder'].name + ", " +
      closest['distance'] + " meters");
  }

  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    let point1 = new google.maps.LatLng(lat1, lng1);
    let point2 = new google.maps.LatLng(lat2, lng2);
    let distance = google.maps.geometry.spherical.computeDistanceBetween(point1, point2);
    return distance;
  }

  findClosestResponder(emergency: Emergency) {
    let minDistance = Infinity;
    let closestResponder = null;
    for (let r of this.responders) {
      let dist = this.calculateDistance(r.lat, r.lng, emergency.Lat, emergency.Lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestResponder = r;
      }
    }
    return { 'responder': closestResponder, 'distance': minDistance };
  }
}
