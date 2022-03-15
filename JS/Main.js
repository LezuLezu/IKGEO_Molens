console.log("JS loaded");

// map
var map = L.map('map').setView([52.0907374, 5.1214201], 8.5);

var mapLayer_streets = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=FyhWpGrC4R5xjalBeWSx', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


scale = L.control.scale().addTo(map);

var north = L.control({position: "bottomright"});
north.onAdd = function() {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML = '<img src="IMG/windroos.png" width="50" height="50" alt="north arrow">';
  return div;
}
north.addTo(map);

// function getMap(data){
//     var windmolens = L.geoJson(data, {
//         style: style,
//         onEachFeature: onEachFeature
//       });
  
//     return windmolens;
//   }
  
//   molens = getMap(molens);
  // molens.addTo(map);


  
function getColor(typeMolen){
    return  typeMolen == "industriemolen" ? "#30123b" :
            typeMolen == "koren-/industriemolen" ? "#466be3" :
            typeMolen == "koren-/zaagmolen" ? "#28bceb" :
            typeMolen == "korenmolen" ? "#32f298" :
            typeMolen == "papiermolen" ? "#eecf3a" :
            typeMolen == "poldermolen" ? "#fb7e21" :
            typeMolen == "zaagmolen" ? "#d02f05" :
            typeMolen == "onbekend" ? "#a4fc3c" :
                                        "#a4fc3c";
}

var style ={
  // "color": getColor(molens.features.properties.HFDFUNCTIE),
  radius: 8,
  fillColor: "#ff7800",
  color: "#000",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8
}

L.geoJSON(molens, {
  pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, style);
  }
}).addTo(map);

console.log(molens);



var windmillIcon = new L.Icon({  
    iconSize: [25,25],
    iconAnchor: [13, 27],
    popupAnchor: [1, -24],
    iconUrl: "IMG/windmill.png"
});