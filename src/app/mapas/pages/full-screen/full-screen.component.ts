import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as mapboxgl  from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styleUrls: ['./full-screen.component.css']
})
export class FullScreenComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
      var map = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ -100.36392988951317, 25.72272680276683],
      zoom: 17
    });
  }

}
