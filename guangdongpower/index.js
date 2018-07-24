
//******************************************* Map HPOM output with hover-over function ******************************************
// Set variable for map and initialize

var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
        maxZoom: 18,
        minZoom: 5
    }),
    normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        maxZoom: 18,
        minZoom: 5
    }),
    imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
        maxZoom: 18,
        minZoom: 5
    }),
    imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
        maxZoom: 18,
        minZoom: 5
    });


var normal = L.layerGroup([normalm, normala]),
    image = L.layerGroup([imgm, imga]);
var baseLayers = {
    "地图": normal,
    "影像": image,
}
var overlayLayers = {
}
var map = L.map("mapid", {
    center: [20.45, 110.2],
    zoom: 11,
    layers: [normal],
    zoomControl: false
});
L.control.layers(baseLayers, overlayLayers).addTo(map);
L.control.zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小'
}).addTo(map);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18, attribution: '[insert correct attribution here!]' });

var clouds = L.OWM.wind({showLegend: true, opacity: 0.5, peedUnit: 'ms', appId: '50fb245848ee7d2c3bc723abd817a15a'}).addTo(map);
var city   = L.OWM.current({intervall: 1, lang: 'de'}).addTo(map);