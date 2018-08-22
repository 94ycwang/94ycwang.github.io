
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
    image  = L.layerGroup([imgm, imga]);

normala.setZIndex(102);
imga.setZIndex(102);
	
var baseLayers = {
    "地图 | Normal Map": normal,
    "影像 | Imagery": image,
	"灰色 | Gray": greym
};
	

var map = L.map("mapid", {
    center: [20.4, 110.2],
	layers: [normal],
    zoom: 9,
    zoomControl: false
});


var zoomHome = L.Control.zoomHome({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
	zoomHomeTitle:'还原'
}).addTo(map);	
		
// Add counties
var counties = new L.Shapefile('https://94ycwang.github.io/guangdongpower/HPOM/guangdong.zip',{
	            style:style, 
				onEachFeature: onEachFeature
}).addTo(map);

function onEachFeature(feature, layer) {
	 var listitem = document.createElement("li");
	 listitem .id = layer.feature.properties.NL_NAME_3 + ' | ' +layer.feature.properties.NAME_34;
	 layer.bindPopup(listitem .id );

};
 
function style(feature) {
    return {
        weight: 2,
        opacity:1,
        fillOpacity: 0,
    };
};

// Add layer& basemap control
var overlayMaps = {
	"县级行政区 | Counties": counties
};
L.control.layers(baseLayers,overlayMaps,{collapsed:false}).addTo(map);



// Add Outage Prediction 
var url = "https://94ycwang.github.io/guangdongpower/HPOM/grid.csv";
group = new L.FeatureGroup();
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  
var csvData = new Array();
var jsonObject = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObject.length; i++) {
  csvData.push(jsonObject[i].split(','));
};

map.createPane("POP");// Create necessary panes in correct order 
rectangle = {};
for (var i = 1;  i< 1555; i++) {
    result= csvData[i];
	var lat1 = result[3];
	var lon1 = result[4];
	var lat2 = result[5];
	var lon2 = result[6]; 

    var bounds = [
        [lat1, lon1],
        [lat2, lon1],
        [lat2, lon2],
        [lat1, lon2],
        [lat1, lon1]
    ];
    rectangle[i]=L.rectangle(bounds, {
		weight: 0.8,
		fillColor: getColor(result[7]), 
		color: 'gray',
		fillOpacity: getfillOpacity(),
		pane: "POP"
    }).bindPopup(
	   "网格中心 | Grid Center : "+result[1]+"N/"+result[2]+"E<br>"+
	   "编号 | ID : "+result[0]+"<br>"+
	   "百分比 | Percentage : "+result[7]+"%<br>"+
	   "更新时间 | Update Time : 08/07 2018"
	  );
	rectangle[i].ID = result[0];
    group.addLayer(rectangle[i]);
};
map.getPane('POP').style.zIndex = 600;
group.addTo(map);

Layers=group.getLayers();
for (var i = 0;  i< 1554; i++) {
    Layers[i].on('mouseover', function(e) {
        var layer = e.target;
        layer.setStyle({
            color: 'black',
            opacity: 1,
            weight: 2.5
        });
		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    });
	Layers[i].on('mouseout', function(e) {
        var layer = e.target;
        layer.setStyle({
            color: 'gray',
            opacity: 1,
            weight: 0.8
        });
    });
	
};	

function getColor(d) {
    return d > 60  ? '#800026' :
           d > 50  ? '#BD0026' :
           d > 40  ? '#E31A1C' :
           d > 30  ? '#FC4E2A' :
           d > 20  ? '#FD8D3C' :
           d > 10  ? '#FEB24C' :
                     '#FFEDA0' ;
};	

// Search by ID
function search(){
	var flag = 0;
	x = document.getElementById("ID").value;
	for (var i = 0;  i< 1554; i++) {
      if (x===Layers[i].ID) {
		  Layers[i].openPopup();
		  flag =1;
        };		
    };
	
	if(flag ===0){
		alert('ID输入错误 | No ID found');
	}

};	

// Add legend
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 10, 20, 30, 40, 50, 60],
    labels = [];
    // Loop through our percentage intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] +'%'+'<br>' :'%+');
    }
    return div;
};
legend.addTo(map);


// Opacity Slider
function getfillOpacity() {
    return $('#layeropacity').val() * '.01'
}
$('#layeropacity').on('input', function (value) {
	group.setStyle({fillOpacity: $(this).val() * '.01'});
});

// Checkbox control 2 -- add layer with legend
function addLayerToMap2(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
		legend.addTo(map);
    } else {
		layer.remove();
        legend.remove(map);		
	};
};

// Add Actual Track
var urltrack = "https://94ycwang.github.io/guangdongpower/HPOM/actual_1522_mujigae.csv";
var request = new XMLHttpRequest();  
request.open("GET", urltrack, false);   
request.send(null);  
var csvDatatrack = new Array();
var jsonObjecttrack = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObjecttrack.length; i++) {
  csvDatatrack.push(jsonObjecttrack[i].split(','));
};

var point={};
var pointList = [];
var circle ={};
var polyline ={};
polylinegroup = new L.FeatureGroup();
cirgroup = new L.FeatureGroup();
map.createPane("trackp");
map.createPane("track");
for (var i = 1; i < jsonObjecttrack.length-1; i++) {
	result   = csvDatatrack[i];   
	var lat  = result[6];
	var lon  = result[7];
	point[i] = new L.LatLng([lat], [lon]);
	pointList.push(point[i]);
	if (result[5]=="TD")      {   x="#fdd835";   };
	if (result[5]=="TS")      {   x="#fbc02d";   };
	if (result[5]=="STS")     {   x="#f9a825";   };
	if (result[5]=="TY")      {   x="#ff8f00";   };
	if (result[5]=="STY")     {   x="#ef6c00";   };
	if (result[5]=="SUPER TY"){   x="#d84315";   };
	if (result[5]=="SUPERTY") {   x="#d84315";   };
	circle[i] = L.circle([lat, lon], {
		color: x,
        opacity: 1,
        weight: 12,
		pane: "trackp",
		rank:result[5]
    }).bindPopup(
	    "<b><font size=4>实际路径 | Actual Track</font></b> <br>"+
	    "时间 | Time : "+ result[3]+ "<br>"+
		"中心位置 | Center : " + lat + "N/" + lon + "E<br>"+
	    "强度 | TCRank : "+result[5]+ "<br>"+
	    "风速 | Wind Speed : "+result[8]+ "m/s<br>"+
	    "阵风 | Gust : "+result[9]+ "m/s<br>"+
	    "气压 | Pressure: "+result[10]+"hPa<br>"+
	    "移向 | Moving Direction: "+result[11]+"°<br>"+
		"移速 | Moving Speed: "+result[12]+"km/h<br>"+
		"七级风圈 | Radius of 30KT Wind: "+result[14]+"km<br>"         
	   
	  );
    circle[i].on('mouseover', function (e) {
        this.openPopup();
		this.setStyle({
            color: 'gray',
            opacity: 1,
            weight: 20
        });
    });
    circle[i].on('mouseout', function (e) {
        this.closePopup();
		this.setStyle({
            opacity: 1,
            weight: 12
        });
		if (this.options.rank=="TD")      {   this.setStyle({ color:"#fdd835" })  };
	    if (this.options.rank=="TS")      {   this.setStyle({ color:"#fbc02d" })  };
	    if (this.options.rank=="STS")     {   this.setStyle({ color:"#f9a825" })  };
	    if (this.options.rank=="TY")      {   this.setStyle({ color:"#ff8f00" })  };
	    if (this.options.rank=="STY")     {   this.setStyle({ color:"#ef6c00" })  };
	    if (this.options.rank=="SUPER TY"){   this.setStyle({ color:"#d84315" })  };
		if (this.options.rank=="SUPERTY") {   this.setStyle({ color:"#d84315" })  };
    });	  
    cirgroup.addLayer(circle[i]);
    
	if(i>1){
	    polyline[i] = new L.Polyline([pointList[i-2],pointList[i-1]], {
		color: x,
        weight: 3,
        opacity: 1,
        smoothFactor: 1,
		pane: "track"
    });	
	polylinegroup.addLayer(polyline[i]);
    };
};

map.getPane('trackp').style.zIndex = 602;
map.getPane('track').style.zIndex = 601;

var best_track = L.layerGroup([cirgroup, polylinegroup]);
best_track.addTo(map);

// Checkbox control 1 -- just add layer
function addLayerToMap1(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
    } else {
		layer.remove();					
	};
};

// Add Forecast Track

var time = document.getElementById("timeSelect").value;	

var urlforecast = "https://94ycwang.github.io/guangdongpower/HPOM/forecast_1522_mujigae.csv";
var request = new XMLHttpRequest();  
request.open("GET", urlforecast, false);   
request.send(null);  
var csvDataforecast = new Array();
var jsonObjectforecast = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObjectforecast.length; i++) {
	csvDataforecast.push(jsonObjectforecast[i].split(','));
};


var forecast_track;
function Time_Function() {
    time = document.getElementById("timeSelect").value;
	if(document.getElementById("Track2").checked === true){
		forecast_track.remove();
		Track_Forecast();
		forecast_track.addTo(map);
	};	
};


function Track_Forecast(){	
	var point_forecast={};
    var pointList_forecast = [];
    var circle_forecast ={};
    var polyline_forecast ={};
    polylinegroup_forecast = new L.FeatureGroup();
    cirgroup_forecast = new L.FeatureGroup();
	num = 0;
	for (var i = 0; i < jsonObjectforecast.length; i++) {
		result   = csvDataforecast[i]; 
		if(result[4]   == time){
			num ++;
			lat  = result[7];
	        lon  = result[8];
	        point_forecast[i] = new L.LatLng([lat], [lon]);
	        pointList_forecast.push(point_forecast[i]);
	        if (result[6]=="TD")      {   x="#fdd835";   };
	        if (result[6]=="TS")      {   x="#fbc02d";   };
	        if (result[6]=="STS")     {   x="#f9a825";   };
	        if (result[6]=="TY")      {   x="#ff8f00";   };
	        if (result[6]=="STY")     {   x="#ef6c00";   };
	        if (result[6]=="Super TY"){   x="#d84315";   };
	        circle_forecast[i] = L.circle([lat, lon], {
				color: x,
				opacity: 1,
                weight: 12,
		        pane: "trackp",
		        rank:result[6]
            }).bindPopup(
			"<b><font size=4>预报路径 | Forecast Track</font></b> <br>"+
			"预报时次 | Lead Time : "+ result[5]+ "h<br>"+
		    "中心位置 | Center : " + lat + "N/" + lon + "E<br>"+
	        "强度 | TCRank : "+result[6]+ "<br>"+
	        "风速 | Wind Speed : "+result[9]+ "m/s<br>"+
	        "阵风 | Gust : "+result[10]+ "m/s<br>"+
	        "气压 | Pressure: "+result[11]+"hPa<br>"+
	        "移向 | Moving Direction: "+result[12]+"°<br>"+
		    "移速 | Moving Speed: "+result[13]+"km/h<br>"+
		    "七级风圈 | Radius of 30KT Wind: "+result[15]+"km<br>"         
			);
            circle_forecast[i].on('mouseover', function (e) {
				this.openPopup();
		        this.setStyle({
					color: 'gray',
					opacity: 1,
					weight: 20
			    });
            });
            circle_forecast[i].on('mouseout', function (e) {
			    this.closePopup();
		        this.setStyle({
                    opacity: 1,
                    weight: 12
                });
		        if (this.options.rank=="TD")      {   this.setStyle({ color:"#fdd835" })  };
	            if (this.options.rank=="TS")      {   this.setStyle({ color:"#fbc02d" })  };
	            if (this.options.rank=="STS")     {   this.setStyle({ color:"#f9a825" })  };
	            if (this.options.rank=="TY")      {   this.setStyle({ color:"#ff8f00" })  };
	            if (this.options.rank=="STY")     {   this.setStyle({ color:"#ef6c00" })  };
	            if (this.options.rank=="Super TY"){   this.setStyle({ color:"#d84315" })   };
            });	  
            cirgroup_forecast.addLayer(circle_forecast[i]);
    
	        if(num>1){
	            polyline_forecast[i] = new L.Polyline([pointList_forecast[num-2],pointList_forecast[num-1]], {
		        color: x,
                weight: 3,
                opacity: 1,
                smoothFactor: 1,
				pane: "track"
            });	
	        polylinegroup_forecast.addLayer(polyline_forecast[i]);
            };
		}; 
	};	
	
    forecast_track = L.layerGroup([cirgroup_forecast, polylinegroup_forecast]);    
};	

// Checkbox control 3 -- add layer of forecast track
function addLayerToMap3(element) {
    if (element.checked){
        Track_Forecast();
		forecast_track.addTo(map);
    } else {
		forecast_track.remove();
	};
	
};