import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import * as mapboxgl  from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styleUrls: ['./zoom-range.component.css']
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoom: number = 10;
  center: [number, number] = [ -100.36392988951317, 25.72272680276683];

  constructor() {

  }
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.divMapa);
      this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoom
    });
    this.mapa.on('zoom', (ev) => {
      this.zoom = this.mapa.getZoom();
    });
    this.mapa.on('zoomend', (ev) => {
      if(this.mapa.getZoom() > 18) {
        this.mapa.zoomTo( 18 );
      }
    });

    //MOVIMIENTO DEL MAPA
    this.mapa.on('move', (eve) => {
      const target = eve.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });
  }

  setZoom( tipo: string) {
    if(tipo === '-') {
      this.mapa.zoomOut();
    } else {
      this.mapa.zoomIn();
    }
  }

  zoomCambio(valor: string) {
    this.mapa.zoomTo(Number(valor));
  }
}
