import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';

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

    addMarker: function(x, y, i, rain) {
        L.marker([x, y], {icon: this.icon}).addTo(this.map)
            .on('click', function(e){
                cController.updateChart(i, x, y, rain);
            });
    },
};

//chart controller
const cController = {
    item: 0,
    allData: [],
    stormLevel: 20,

    updateChart: function(t, x, y, rain) {
        this.item = t;
        const data = this.allData[t];
        let xLine = [];
        for (let i = 0; i < data.length; i++) {
            let time = (parseInt(i / 24)) + "d " + (i % 24) + "h";
            xLine.push(time);
        }

        let trace1 = {
            x: xLine,
            y: data,
            type: 'scatter'
        };
        let trace2 = this.addSquare(rain);
        let layout = {
            title: x + ", " + y,
            width: window.innerWidth,
            height: window.innerHeight / 2
        };
        Plotly.newPlot('lineChart', [trace1, trace2], layout);
    },

    addSquare: function(storm) {
        let start = parseInt(storm[0][0] / 24) + "d " + (storm[0][0] % 24) + "h";
        const stormLen = storm.length;
        let end = parseInt(storm[stormLen-1][1] / 24) + "d " + (storm[stormLen-1][1] % 24) + "h";
        const data = this.allData[this.item];
        //get start
        for (let i = storm[0][0]; i <= storm[stormLen-1][1]; i++) {
            if (data[i] >= 20) {
                start = parseInt(i / 24) + "d " + (i % 24) + "h";
                break;
            }
        }

        //get end
        for (let i = storm[stormLen-1][1]; i >= storm[0][0]; i--) {
            if (data[i] >= 20) {
                end = parseInt(i / 24) + "d " + (i % 24) + "h";
                break;
            }
        }

        const max = Math.max(...data) + 5;
        let trace = {
            x: [start, end],
            y: [max, max],
            fill: 'tozeroy',
            type: 'scatter'
        };
        return trace;
    },
}

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
    await getData.request('rainStorm.json');
    const markers = getData.resData;

    await getData.request('rainOrigin.json');
    cController.allData = getData.resData;
    markers.forEach(function(marker, i) {
        lController.addMarker(marker[1], marker[0], i, marker[2]);
    });
})();
