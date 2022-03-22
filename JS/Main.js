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

// console.log(molens);

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
  onEachFeature: function(feature, layer){
    layer.bindPopup("<h3 class='popup__naam'>" + feature.properties.NAAM + "<h3>"
                    + "<p class='popup__text'>Functie: " + feature.properties.FUNCTIE + "<br>"
                    + "Plaats: " + feature.properties.PLAATS + "<br>"
                    + "Staat: " + feature.properties.STAAT + "<br>"
                    + "Bouwjaar: " + feature.properties.BOUWJAAR + "</p>"
                    // Figure with thumbnail
                    + "<figure class='popup__figure'> "
                    + "<img class='popup__figure--image' alt='" + feature.properties.NAAM + "' src='" + feature.properties.THUMBNAIL + "'> "
                    // onclick='onClick("+[feature.properties.FOTO_GROOT, feature.properties.NAAM]+")'
                    + "<figcaption class='popup__figure--figcap' > Foto van: " + feature.properties.FOTOGRAAF + "</figcation> "
                    + "</figure>"
                    //  Links
                    + "<p class='pupup__text--links'> <a class='popup__link popup__link--route' target='_blank' href='"+ makeSearchQuery(feature.properties.NAAM) +  "'> Route </a> <br>"
                    + "<a class='popup__link popup__link--info' target='_blank' href=" + feature.properties.INFOLINK +"> Meer informatie </a> </p>");
  },
  pointToLayer: function(feature, latlng){
    return L.marker(latlng, {icon: getColor(feature.properties.HFDFUNCTIE)});
  }
}).addTo(map);

function makeSearchQuery(featureName){
  // Custom search qeury to google maps for directions to location
  featureName = featureName.replace(/ /g,"+");
  featureName = "Molen+" + featureName;
  searchQuery = "https://www.google.nl/maps/dir//" + featureName;
  return searchQuery;
}
// TODO Fix center marker popup on click

// TODO Fix large image display
// function onClick(img, name){
//   console.log("IN click event " + feature);
//   // document.getElementById("zoomImage").src = ft[0];
//   // document.getElementById("zoomImage").alt = ft[1];
//   // document.getElementById("zoomImageFig").style.display = "block";
// }


