console.log("JS loaded");

// Navigation control
function openNav() {
  document.getElementById("sideNav").classList.add("sideNav__open");
}
function closeNav() {
  document.getElementById("sideNav").classList.remove("sideNav__open");
}
// Filter controll
// if radiobutton for all is checked, check all radio buttons for type of molen
document.getElementById("windmills--all").addEventListener("click", filterAll);
function filterAll(){
  allBoxes = document.getElementsByClassName("filter--windmillType");
  if(document.getElementById("windmills--all").checked){
    for(i = 0; i < allBoxes.length; i++){
      allBoxes[i].checked = true;
    }
  }else if(!document.getElementById("windmills--all").checked){
    for(i = 0; i < allBoxes.length; i++){
      allBoxes[i].checked = false;
    }
  }
}
// if any radiobutton is unclicked, uncheck  radio buttons for windmills--all
let allWindmillBoxes = document.getElementsByClassName("filter--windmillType");
for(box = 0; box < allWindmillBoxes.length; box++){
  allWindmillBoxes[box].addEventListener("click", checkAll);
}
function checkAll(){
  allBoxes = document.getElementsByClassName("filter--windmillType");
  checkCount = 0;
  for(i = 0; i < allBoxes.length; i++){
    if(allBoxes[i].checked){
      checkCount++;
    }
  }
  if(checkCount != allBoxes.length){
    document.getElementById("windmills--all").checked = false;
  }else if(checkCount == allBoxes.length){
    document.getElementById("windmills--all").checked = true;
  }
}

// map
var map = L.map('map',{zoomControl: false}).setView([52.0907374, 5.1214201], 8.5);

var mapLayer_streets = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=FyhWpGrC4R5xjalBeWSx', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);


scale = L.control.scale({position:'topright'}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);

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
    layer.bindPopup("<h3 class='popup__naam'>" + feature.properties.NAAM + "</h3>"
                    + "<p class='popup__text'>Functie: " + feature.properties.FUNCTIE + "<br>"
                    + "Plaats: " + feature.properties.PLAATS + "<br>"
                    + "Staat: " + feature.properties.STAAT + "<br>"
                    + "Bouwjaar: " + feature.properties.BOUWJAAR + "</p>"
                    // Figure with thumbnail
                    + "<figure class='popup__figure'> "
                    + "<img class='popup__figure--image' alt='" + feature.properties.NAAM + "' src='" + feature.properties.THUMBNAIL + "'> "
                    + "<figcaption class='popup__figure--figcap' > Foto van: " + feature.properties.FOTOGRAAF + "</figcation> "
                    + "</figure>"
                    //  Links
                    + "<p class='pupup__text--links'> <a class='popup__link popup__link--route' target='_blank' href='"+ makeSearchQuery(feature.properties.NAAM) +  "'> Route </a> <br>"
                    + "<a class='popup__link popup__link--info' target='_blank' href=" + feature.properties.INFOLINK +"> Meer informatie </a> </p>");
  },
  pointToLayer: function(feature, latlng){
    return L.marker(latlng, {icon: getColor(feature.properties.HFDFUNCTIE)});
  }
});

var molenClusters = new L.markerClusterGroup({
  iconCreateFunction: function(cluster){
    let childCount = cluster.getChildCount();
    if(childCount <= 10){
      windmillBackground = "windmill__icon--green";
    }else if(childCount > 10 && childCount <= 20){
      windmillBackground = "windmill__icon--yellow";
    }else if(childCount > 20 && childCount <= 50){
      windmillBackground = "windmill__icon--orange";
    }else if(childCount > 50){
      windmillBackground = "windmill__icon--red";    }
    
    var html = '<div class="windmill__icon"> <p class="windmill__icon--text">' + childCount + '</p></div>';

    return L.divIcon({ html: html, className: 'windmill__cluster ' + windmillBackground, iconSize: L.point(32, 32)});
    
  },
  spiderfyOnMaxZoom: false, showCoverageOnHover: true, zoomToBoundsOnClick: true, animateAddingMarkers: true
}).addLayer(molenLayer);

// Load right layer on opening site
if(map.getZoom() >= 11){
  map.addLayer(molenLayer);
}
else if(map.getZoom() <= 10){
  map.addLayer(molenClusters);
}
// point to correct layer on zooming in or out
map.on('zoom', function(){
  console.log(map.getZoom())
  if(map.getZoom() >= 11){
    map.removeLayer(molenClusters);
    map.addLayer(molenLayer);
  }
  else if(map.getZoom() <= 10){
    map.removeLayer(molenLayer);
    map.addLayer(molenClusters);
  }
})



// TODO Fix center marker popup on click 
map.on('popupopen', function(e) {
  let px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
  px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
  map.panTo(map.unproject(px),{animate: true}); // pan to new center
});


function makeSearchQuery(featureName){
  // Custom search qeury to google maps for directions to location
  featureName = featureName.replace(/ /g,"+");
  featureName = "Molen+" + featureName;
  searchQuery = "https://www.google.nl/maps/dir//" + featureName;
  return searchQuery;
}

