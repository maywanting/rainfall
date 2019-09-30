import colormap from 'colormap'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import $ from 'jquery';

console.log("hahahahaahah");
//leaflet controller
const lController = {
    map: L.map('map').setView([26, 106], 7),
    colors: colormap({
        colormap: 'jet',
        nshades: 411,
        format: 'hex',
        alpha: 1
    }),

    icon: L.icon({
        iconUrl: '/public/marker.png',
        iconSize: [19, 30]
    }),

    initMap: function() {
        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets-satellite/{z}/{x}/{y}.jpg90?access_token=pk.eyJ1IjoicmRkOTk5OSIsImEiOiJjajR0Z2JkZWowN3hyMndxcHNwZ3BxaTQ3In0.QodYw16EwlKvaSGQLXhaIQ', {
            maxZoom: 18,
            attributionCon: false,
        }).addTo(this.map);
    },

    addMarker: function(x, y) {
        L.marker([x, y], {icon: this.icon}).addTo(this.map);
    },

    addRectangle: function(x, y, t, color) {
        let bounds = [[parseFloat(x) + 0.0625, parseFloat(y) + 0.0625], [parseFloat(x) - 0.0625, parseFloat(y) - 0.0625]];
        let colorNum = parseInt(t * 100 + 183);
        L.rectangle(bounds, {fillColor: color, fillOpacity: 0.5, weight:0}).addTo(this.map);
    },
};

//chart controller
const cController = {
    updateChart: function(x, y, tmp) {
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
    await getData.request('allPlace.json');
    const allData = getData.resData;

    await getData.request('year.json');
    const year = getData.resData;

    //display the temperature in the whole map
    allData.forEach(function(data, i) {
        lController.addRectangle(data[0], data[1], data[2], data[3]);
    });

    //display the marker
    lController.addMarker(26.57, 106.71);

    //display chart
    let data = [];
    let label = [];
    let num = 24*1;
    for (let i = 17; i < num + 17; i++) {
        data.push((year[i][1] - 32) / 1.8);
        label.push((24 + 16 - i) + "&nbsp;");
    }

    let trace1 = {
        x: label,
        y: data,
        type: 'scatter'
    };

    let layout = {
        title: '26.57, 106.71',
        width: window.innerWidth,
        height: window.innerHeight / 2,
        xaxis: {
            title: 'Time (hour)',
        },
        yaxis: {
            title: 'Temperature (℃ )',
        }
    };

    Plotly.newPlot('lineChart', [trace1], layout);
})();
