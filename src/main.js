import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// import SelectArea from 'leaflet-area-select';

//leaflet controller
const lController = {
    map: L.map('map').setView([35, 136], 7),
    icon: L.icon({
        iconUrl: '/public/marker.png',
        iconSize: [19, 30]
    }),

    initMap: function() {
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attributionCon: false,
        }).addTo(this.map);
    },

    addMarker: function(x, y) {
        L.marker([x, y], {icon: this.icon}).addTo(this.map);
    },
};

const getData = {
    filePath: '/public/',
    resData: 'aa',
    request: function(fileName) {
        const file = this.filePath + fileName;
        return fetch(file).then(response => response.json()).then(jsondata => {
            this.resData = jsondata;
        });
    },
};

(async function() {
    lController.initMap();
    // console.log('start');
    await getData.request('rainStorm.json');
    const markers = getData.resData;
    markers.forEach(function(marker) {
        lController.addMarker(marker[1], marker[0]);
    });
})();
