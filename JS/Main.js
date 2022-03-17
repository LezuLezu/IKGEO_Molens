console.log("JS loaded");

// map
var map = L.map('map').setView([52.0907374, 5.1214201], 8.5);

var mapLayer_streets = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=FyhWpGrC4R5xjalBeWSx', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


scale = L.control.scale().addTo(map);

var north = L.control({position: "bottomright"});
north.onAdd = function() {
  var div = L.DomUtil.create("div", "windroos");
  div.innerHTML = '<img src="IMG/windroos.png" width="75" height="75" alt="north arrow">';
  return div;
}
north.addTo(map);
  
function getColor(typeMolen){
    return  typeMolen == "industriemolen" ? windmillIcon_Purple :
            typeMolen == "koren-/industriemolen" ? windmillIcon_Pink :
            typeMolen == "koren-/zaagmolen" ? windmillIcon_Orange :
            typeMolen == "korenmolen" ? windmillIcon_Red :
            typeMolen == "papiermolen" ? windmillIcon_Cyan :
            typeMolen == "poldermolen" ? windmillIcon_Blue :
            typeMolen == "zaagmolen" ? windmillIcon_Green :
            typeMolen == "onbekend" ? windmillIcon_Brown :
                                        windmillIcon_Brown;
}

console.log(molens);

// Windmill icons
var windmillIcon = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill.png"
});
var windmillIcon_Blue = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_blue.png"
});
var windmillIcon_Brown = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_brown.png"
});
var windmillIcon_Cyan = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_cyan.png"
});
var windmillIcon_Green = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_green.png"
});
var windmillIcon_Orange = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_orange.png"
});
var windmillIcon_Pink = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_pink.png"
});
var windmillIcon_Purple = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_purple.png"
});
var windmillIcon_Red = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/windmill_red.png"
});


var molenLayer = L.geoJSON(molens, {
  pointToLayer: function(feature, latlng){
    return L.marker(latlng, {icon: getColor(feature.properties.HFDFUNCTIE)});
  }
}).addTo(map);


console.log(molens.features[0].properties.NAAM)
console.log(molens.features[0].geometry.coordinates)

