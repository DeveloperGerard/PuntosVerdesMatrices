import puntosVerdes from "./puntosVerdes.js";

const LATITUD_OSORNO = -40.58;
const LONGITUD_OSORNO = -73.11;
const ZOOM_INICIAL = 13;

const IconoVerde = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const IconoUsuario = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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

                if (typeof marcadorUsuario !== 'undefined' && marcadorUsuario) {
                    const latLngUsuario = marcadorUsuario.getLatLng();
                    const latLngPunto = L.latLng(punto.lat, punto.lng);
                    const distanciaMetros = latLngUsuario.distanceTo(latLngPunto);

                    let textoDistancia;
                    if (distanciaMetros > 1000) {
                        textoDistancia = (distanciaMetros / 1000).toFixed(2) + " km";
                    } else {
                        textoDistancia = Math.round(distanciaMetros) + " m";
                    }
                    $("#distanciaPunto").text(textoDistancia);
                } else {
                    $("#distanciaPunto").text("Ubicación no definida");
                }
            });
        });
    }

    renderMarkers(puntosVerdes);

    const inputBusqueda = document.querySelector('#busq input');


    let marcadorUsuario;

    async function buscarDireccion(direccion) {
        if (!direccion) return;

        // Agregar "Osorno, Chile" para mejorar la precisión si el usuario no lo especifica
        const query = `${direccion}, Osorno, Chile`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lon = parseFloat(data[0].lon);

                if (marcadorUsuario) {
                    mapa.removeLayer(marcadorUsuario);
                }

                marcadorUsuario = L.marker([lat, lon], { icon: IconoUsuario }).addTo(mapa);
                marcadorUsuario.bindPopup(`<b>Tu Ubicación</b><br>${data[0].display_name}`).openPopup();
                mapa.setView([lat, lon], 15);
            } else {
                alert("No se encontró la dirección.");
            }
        } catch (error) {
            console.error("Error al buscar la dirección:", error);
            alert("Hubo un error al buscar la dirección.");
        }
    }

    const btnBuscarDireccion = document.getElementById('btnBuscarDireccion');
    const inputDireccion = document.getElementById('inputDireccion');

    if (btnBuscarDireccion && inputDireccion) {
        btnBuscarDireccion.addEventListener('click', () => {
            buscarDireccion(inputDireccion.value);
        });

        inputDireccion.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarDireccion(inputDireccion.value);
            }
        });
    }
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