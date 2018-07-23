
//******************************************* Map HPOM output with hover-over function ******************************************
// Set variable for map and initialize

var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 5
});
var imgm = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
    maxZoom: 18,
    minZoom: 5
});
var imga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
    maxZoom: 18,
    minZoom: 5
});
var normal = L.layerGroup([normalm]),
    image = L.layerGroup([imgm, imga]);
var baseLayers = {
    "地图": normal,
    "影像": image,
}
var mymap = L.map('mapid', {
    center: [20.45, 110.2],
    zoom: 11,
    layers: [normal],
    zoomControl: false
});
L.control.layers(baseLayers, null).addTo(mymap);
L.control.zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小'
}).addTo(mymap);

//
var county = JSON.parse(Get('https://94ycwang.github.io/guangdongpower/HPOM/440800.json'));	

function style(feature) {
    return {
        fillColor: false,
		fillOpacity:0,
        weight: 0.3,
        opacity:1,
        color: 'black'
		
    };
};

LHPOM     = L.geoJson(county, {style: style}).addTo(mymap);