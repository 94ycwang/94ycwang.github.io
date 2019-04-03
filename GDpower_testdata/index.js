
// Set variable for map and initialize
var normalm = L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
        maxZoom: 18,
    }),
    /*normala = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {
        maxZoom: 18,
    }),*/
    imgm = L.tileLayer.chinaProvider('GaoDe.Satellite.Map', {
        maxZoom: 18,
    }),
    imga = L.tileLayer.chinaProvider('GaoDe.Satellite.Annotion', {
        maxZoom: 18,
    }),

	greym = L.tileLayer.chinaProvider('Geoq.Normal.Gray', {
        maxZoom: 18,
    });

var normal = L.layerGroup([normalm]),
    image  = L.layerGroup([imgm, imga]);


var baseLayers = {
    "地图 | Normal Map": normal,
    "影像 | Imagery": image
};
	

var map = L.map("mapid", {
    center: [20.4, 110.2],
	layers: [normal],
    zoom: 10,
    zoomControl: false
});


var zoomHome = L.Control.zoomHome({
    zoomInTitle: '放大',
    zoomOutTitle: '缩小',
	zoomHomeTitle:'还原'
}).addTo(map);	
		

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

var overlayMaps = {
	"县级行政区 | Counties": counties
};

L.control.layers(baseLayers,overlayMaps,{collapsed:false}).addTo(map);


// Add weather map layers

var winds = L.OWM.wind({opacity: getfillOpacity(),appId: '50fb245848ee7d2c3bc723abd817a15a'});
var city = L.OWM.current({intervall: 15,useLocalTime: true ,lang:'CE', appId: '50fb245848ee7d2c3bc723abd817a15a'});
var precipitation =  L.OWM.precipitationClassic({showLegend: true, opacity: getfillOpacity(), appId: '50fb245848ee7d2c3bc723abd817a15a'});

winds.setZIndex(100);
precipitation.setZIndex(100);
/*normala.setZIndex(102);*/
imga.setZIndex(102);

// Checkbox control 1
function addLayerToMap(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
    } else {
		layer.remove();					
	};
};


//
var url = "https://94ycwang.github.io/guangdongpower/HPOM/outage_grid.csv";
group = new L.FeatureGroup();
var request = new XMLHttpRequest();  
request.open("GET", url, false);   
request.send(null);  
var csvData = new Array();
var jsonObject = request.responseText.split(/\r?\n|\r/);
for (var i = 0; i < jsonObject.length; i++) {
  csvData.push(jsonObject[i].split(','));
};

// Create necessary panes in correct order (i.e. "bottom-most" first).
map.createPane("POP");
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


//
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



// Checkbox control 2
function addLayerToMap2(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
		legend.addTo(map);
    } else {
		layer.remove();
        legend.remove(map);		
	};
};

// Opacity Slider
function getfillOpacity() {
    return $('#layeropacity').val() * '.01'
}
$('#layeropacity').on('input', function (value) {
    winds.setOpacity($(this).val() * '.01');
	precipitation.setOpacity($(this).val() * '.01');
	group.setStyle({fillOpacity: $(this).val() * '.01'});
});

// Get Typhoon Location
function formatterDateTime() {
  var date=new Date()
  var month=date.getMonth() + 1
        var datetime = date.getFullYear()
                + ""// "年"
                + (month >= 10 ? month : "0"+ month)
                + ""// "月"
                + (date.getDate() < 10 ? "0" + date.getDate() : date
                        .getDate())
                + ""
                + (date.getHours() < 10 ? "0" + date.getHours() : date
                        .getHours())
                + ""
                + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                        .getMinutes())
                + ""
                + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                        .getSeconds());
        return datetime;
    };

var result = null;	
	
$.ajax({
    type: 'post',
    url: 'https://route.showapi.com/342-1',
    dataType: 'json',
	async :false, 
    data: {
        "showapi_timestamp": formatterDateTime(),
        "showapi_appid": '70942', //appid
        "showapi_sign": 'd1047560d33a46e98903a1e831f9989d',  //secret
    },

    error: function(XmlHttpRequest, textStatus, errorThrown) {
        alert("获取台风信息失败! Failed to get Typhoon information!");
    },
    success: function(data) {
        result = data;
	}
		
});

var str = document.getElementById("number").innerHTML; 
var res = str.replace("NaN", result.showapi_res_body.list.length);
document.getElementById("number").innerHTML = res;

var TyphoonIcon = L.icon({
    iconUrl: 'HPOM/giphy.gif',
	iconSize:[80, 50]	
});

var Typhoon = {};	
var x = {};
var	text1 = {};
var text2 = {};
for (var i = 0; i < result.showapi_res_body.list.length; i++) {	 
     Typhoon[i] = L.marker([result.showapi_res_body.list[i].lat, result.showapi_res_body.list[i].lng], 
                 {icon: TyphoonIcon}).addTo(map).bindPopup(
				 "<b><font size=4>"+result.showapi_res_body.list[i].name+' | </b>'+result.showapi_res_body.list[i].enname+"  "+result.showapi_res_body.list[i].tfid+"</font><br>"+
		         "中心位置 | Center : " + result.showapi_res_body.list[i].lat + "N/" + result.showapi_res_body.list[i].lng + "E<br>"+
		         "强度 | TCRank: "+result.showapi_res_body.list[i].strong+"<br>"+
		         "风速 | Wind Speed: "+result.showapi_res_body.list[i].speed+"m/s<br>"+
				 "风力 | Wind Force: "+result.showapi_res_body.list[i].power+"<br>"+ 
		         "移向 | Moving Direction: "+result.showapi_res_body.list[i].movedirection+"<br>"+
		         "移速 | Moving Speed: "+result.showapi_res_body.list[i].movespeed+"km/h<br>"+
		         "气压 | Pressure: "+result.showapi_res_body.list[i].pressure+"hPa<br>"+
		         "七级风圈 | Radius of 30KT Wind: "+result.showapi_res_body.list[i].radius7+"km<br>"+ 
		         "更新时间 | Update Time: "+result.showapi_res_body.list[i].time+"<br>"					 
	            ,{maxWidth : 560
				});
						
	 x[i] = document.createElement("INPUT");
     x[i].setAttribute("type", "checkbox");
	 x[i].num =i;
	 if(i==0){
            x[i].setAttribute("onclick", "ZoomToTyphoon(x[0])");
            document.getElementById("typhoonlist").appendChild(x[0]);
	 };
	 if(i==1){
            x[i].setAttribute("onclick", "ZoomToTyphoon(x[1])");
            document.getElementById("typhoonlist").appendChild(x[1]);
	 };
	 if(i==2){
            x[i].setAttribute("onclick", "ZoomToTyphoon(x[2])");
            document.getElementById("typhoonlist").appendChild(x[2]);
	 };
	 if(i==3){
            x[i].setAttribute("onclick", "ZoomToTyphoon(x[3])");
            document.getElementById("typhoonlist").appendChild(x[3]);
	 };
	 if(i==4){
            x[i].setAttribute("onclick", "ZoomToTyphoon(x[4])");
            document.getElementById("typhoonlist").appendChild(x[4]);
	 };
     text1[i] = document.createElement('a');
     document.getElementById("typhoonlist").appendChild(text1[i]);
     text1[i].innerHTML= ' ' + result.showapi_res_body.list[i].name+' ';
     text1[i].style='font:16px 宋体;font-weight:bold'
	 text2[i] = document.createElement('a');
     document.getElementById("typhoonlist").appendChild(text2[i]);
     text2[i].innerHTML= '| '+result.showapi_res_body.list[i].enname+"  "+result.showapi_res_body.list[i].tfid+"<br>";
     text2[i].style='font: 16px Book Antiqua; font-weight:bold;'
};



function ZoomToTyphoon(element) {
    if (element.checked){
		Typhoon[element.num].addTo(map);
		Typhoon[element.num].openPopup();
		var latLngs =Typhoon[element.num].getLatLng();
        map.panTo(latLngs);
		map.setZoom(6);
    } else {
		Typhoon[element.num].remove();					
	};
};