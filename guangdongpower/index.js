
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

console.log(counties);

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
normala.setZIndex(102);
imga.setZIndex(102);

function addLayerToMap(element, layer) {
	
    if (element.checked){
		layer.addTo(map);
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
		         "台风等级 | Typhoon Classification: "+result.showapi_res_body.list[i].strong+"<br>"+
		         "最大风速 | Maximum Wind Speed: "+result.showapi_res_body.list[i].speed+"m/s<br>"+
				 "风力等级 | Wind Force: "+result.showapi_res_body.list[i].power+"<br>"+ 
		         "移动方向 | Moving Direction: "+result.showapi_res_body.list[i].movedirection+"<br>"+
		         "移动速度 | Moving Speed: "+result.showapi_res_body.list[i].movespeed+"km/h<br>"+
		         "中心气压 | Pressure: "+result.showapi_res_body.list[i].pressure+"hPa<br>"+
		         "七级风力影响半径 | Influence Radius (Beaufort Number:7): "+result.showapi_res_body.list[i].radius7+"km<br>"+ 
		         "更新时间 | Update Time: "+result.showapi_res_body.list[i].time+"<br>"					 
	            ,{maxWidth : 560
				});
						
	 x[i] = document.createElement("INPUT");
     x[i].setAttribute("type", "checkbox");
	 x[i].num =i;
	 if(i==0){
            x[i].setAttribute("onchange", "ZoomToTyphoon(x[0])");
            document.getElementById("list").appendChild(x[0]);
	 };
	 if(i==1){
            x[i].setAttribute("onchange", "ZoomToTyphoon(x[1])");
            document.getElementById("list").appendChild(x[1]);
	 };
	 if(i==2){
            x[i].setAttribute("onchange", "ZoomToTyphoon(x[2])");
            document.getElementById("list").appendChild(x[2]);
	 };
	 if(i==3){
            x[i].setAttribute("onchange", "ZoomToTyphoon(x[3])");
            document.getElementById("list").appendChild(x[3]);
	 };
	 if(i==4){
            x[i].setAttribute("onchange", "ZoomToTyphoon(x[4])");
            document.getElementById("list").appendChild(x[4]);
	 };
     text1[i] = document.createElement('a');
     document.getElementById("list").appendChild(text1[i]);
     text1[i].innerHTML= ' ' + result.showapi_res_body.list[i].name+' ';
     text1[i].style='font:16px 宋体;font-weight:bold'
	 text2[i] = document.createElement('a');
     document.getElementById("list").appendChild(text2[i]);
     text2[i].innerHTML= '| '+result.showapi_res_body.list[i].enname+"  "+result.showapi_res_body.list[i].tfid;
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