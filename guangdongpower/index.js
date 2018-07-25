
//******************************************* Map HPOM output with hover-over function ******************************************
// Set variable for map and initialize
var normalm = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {
        maxZoom: 18,
    }),
    normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        maxZoom: 18,
    }),
    imgm = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {
        maxZoom: 18,
    }),
    imga = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {
        maxZoom: 18,
    }),

	greym = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
        maxZoom: 18,
    });

var normal = L.layerGroup([normalm, normala]),
    image = L.layerGroup([imgm, imga]);

var baseLayers = {
    "地图": normal,
    "影像": image,
};
var overlayMaps = {
};
var map = L.map("mapid", {
    center: [20.45, 110.2],
    zoom: 10,
    layers: [normal],
    zoomControl: false
});
L.control.layers(baseLayers,overlayMaps,{collapsed:false}).addTo(map);
L.control.zoom({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小'
}).addTo(map);

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18, attribution: '[insert correct attribution here!]' });

// Add weather map layers

var winds = L.OWM.wind({opacity: getfillOpacity(),appId: '50fb245848ee7d2c3bc723abd817a15a'});
var city = L.OWM.current({intervall: 15,useLocalTime: false ,appId: '50fb245848ee7d2c3bc723abd817a15a'});
var precipitation =  L.OWM.precipitationClassic({showLegend: true, opacity: getfillOpacity(), appId: '50fb245848ee7d2c3bc723abd817a15a'});



function addLayerToMap(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
        layer.bringToFront();		
    } else {
		layer.remove();					
	};
};

// Opacity Slider
function getfillOpacity() {
    return $('#layeropacity').val() * '.01'
}
$('#layeropacity').on('input', function (value) {
    winds.setOpacity($(this).val() * '.01');
	precipitation.setOpacity($(this).val() * '.01');
});

//
function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // A new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
};

var county = JSON.parse(Get('https://94ycwang.github.io/guangdongpower/HPOM/440800.json'));	
L.geoJson(county);
counties = new L.Shapefile('https://94ycwang.github.io/guangdongpower/HPOM/CHN_adm3.zip').addTo(map);
