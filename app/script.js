
import puntosVerdes from "./puntosVerdes.js";

const LATITUD_OSORNO = -40.58;
const LONGITUD_OSORNO = -73.11;
const ZOOM_INICIAL = 13;

// --- B.DATOS DE LOS PUNTOS VERDES-- -
// const puntosVerdes = [
//     { lat: -40.554960283646366, lng: -73.15505952664618, nombre: "Papel", descripcion: "Punto de reciclaje papel." },
//     { lat: -40.557931469867086, lng: -73.15360040496259, nombre: "Cartón", descripcion: "Punto de reciclaje cartón." },
//     { lat: -40.558133212294926, lng: -73.1546303732114, nombre: "Plastico", descripcion: "Punto de reciclaje plastico." },
//     { lat: -40.57397311016472, lng: -73.14947027145598, nombre: "Vidrio", descripcion: "Punto de reciclaje vidrio." } // prueba
// ];

const IconoVerde = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function inicializarMapa() {
    const mapa = L.map('map', { attributionControl: false }).setView([LATITUD_OSORNO, LONGITUD_OSORNO], ZOOM_INICIAL);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: ''
    }).addTo(mapa);

    const marcadoresLayer = L.layerGroup().addTo(mapa);

    function renderMarkers(puntos) {
        marcadoresLayer.clearLayers();
        puntos.forEach(function (punto) {
            const marcador = L.marker([punto.lat, punto.lng], { icon: IconoVerde }).addTo(marcadoresLayer);
            marcador.bindPopup(`
                <h3>${punto.nombre}</h3>
                <p>${punto.direccion}</p>
            `);

            marcador.on('click', function (e) {
                console.log('Marcador clickeado:', punto.nombre, { punto: punto, evento: e });
                $("#nombrePunto").text(String(punto.nombre));
                $("#direccionPunto").text(String(punto.direccion));
                $("#materialPunto").text(String(punto.tipos));
                $("#latitudPunto").text(String(punto.lat));
                $("#longitudPunto").text(String(punto.lng));
            });
        });
    }

    renderMarkers(puntosVerdes);

    const inputBusqueda = document.querySelector('#busq input');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('input', function (e) {
            const texto = e.target.value.toLowerCase();
            const filtrados = puntosVerdes.filter(punto =>
                punto.tipos && punto.tipos.some(tipo => tipo.toLowerCase().includes(texto))
            );
            renderMarkers(filtrados);
        });
    }
}

document.addEventListener('DOMContentLoaded', inicializarMapa);

$(document).ready(function () {
    console.log("jQuery está funcionando!");
});
