import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as mapboxgl  from 'mapbox-gl';

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styleUrls: ['./marcadores.component.css']
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef;
  mapa!: mapboxgl.Map;
  zoom: number = 15;
  center: [number, number] = [ -100.3448499464102, 25.695832755060867];

  //ARREGLO DE MARCADORES
  marcadores: MarcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit', this.divMapa);
      this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoom
    });

    this.leerLocalStorage();

    this.mapa.on('move', (eve) => {
      const target = eve.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    });

    /* const markerHTML: HTMLElement = document.createElement('div');
    markerHTML.innerHTML = 'Hola Mundo'; */

    /* new mapboxgl.Marker()
    .setLngLat(this.center)
    .addTo(this.mapa); */
  }

  agregarMArcador() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    console.log(color)
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color
    })
    .setLngLat(this.center)
    .addTo(this.mapa);
    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    });
  }


  irMarcador(marker: mapboxgl.Marker) {
    this.mapa.flyTo({
      center: marker.getLngLat(),
      zoom: 15
    })
  }

  guardarMarcadoresLocalStorage() {
    const arreglo: MarcadorColor[] = []
    this.marcadores.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();
      arreglo.push({
        color: color,
        centro: [lng, lat]
      });
    });
    localStorage.setItem('marcadores', JSON.stringify(arreglo));
  }

  leerLocalStorage() {
    if(!localStorage.getItem('marcadores')){
      return;
    }
    const arreglo: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);
    arreglo.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat(m.centro!)
      .addTo(this.mapa);
      this.marcadores.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      });
    });
  }

  borrarMarcador(index: number) {
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index, 1);
    this.guardarMarcadoresLocalStorage();
  }

}
