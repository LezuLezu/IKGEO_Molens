console.log("JS loaded");

// Const vars
// Counts for clusters
const lowCount = 20;
const low_medCount = 50;
const med_highCount = 80;
// Zoom min/max
const zoomMax_to_molenClusters = 10;
const zoomMin_to_molenLayer = 11;
// Windmill icons
const windmillIcon_Blue = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/blue_windmills/windmill_blue_25.png"
});
const windmillIcon_Brown = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/brown_windmills/windmill_brown_25.png"
});
const windmillIcon_Cyan = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/cyan_windmills/windmill_cyan_25.png"
});
const windmillIcon_Green = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/green_windmills/windmill_green_25.png"
});
const windmillIcon_Orange = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/orange_windmills/windmill_orange_25.png"
});
const windmillIcon_Pink = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/pink_windmills/windmill_pink_25.png"
});
const windmillIcon_Purple = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/purple_windmills/windmill_purple_25.png"
});
const windmillIcon_Red = new L.Icon({  
  iconSize: [25,25],
  iconAnchor: [13, 27],
  popupAnchor: [1, -24],
  iconUrl: "IMG/red_windmills/windmill_red_25.png"
});

// map
let map = L.map('map',{zoomControl: false}).setView([52.0907374, 5.1214201], 7);

let mapLayer_streets = L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}@2x.png?key=FyhWpGrC4R5xjalBeWSx', {
  attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
}).addTo(map);

scale = L.control.scale({position:'topright'}).addTo(map);
L.control.zoom({position:'topright'}).addTo(map);

let north = L.control({position: "bottomright"});
north.onAdd = function() {
  let div = L.DomUtil.create("div", "windroos");
  div.innerHTML = '<img src="IMG/windroos/windroos_75x75.png" width="75" height="75" alt="north arrow">';
  return div;
};
north.addTo(map);

// darken out other countries
function getCountryColor(country){
  return country != "Netherlands" ? '#1E1B18':
                  "#ffffff";
}
function getCountryOpacity(country){
  return country != "Netherlands" ? 0.8:
                  0;
}
function getBorderColor(country){
  return country != "Netherlands" ? '#D8315B':
                  "#ffffff";                  
}
function getBorderOpacity(country){
  return country != "Netherlands" ? 0.8:
                  0;
}
function borderStyle(feature){
  return {
    fillColor: getCountryColor(feature.properties.NAME),
    fillOpacity:getCountryOpacity(feature.properties.NAME),
    weight: 1,
    opacity: getBorderOpacity(feature.properties.NAME),
    color: getBorderColor(feature.properties.NAME),
    dashArray: '3',    
  };
}
const borderLayer = L.geoJson(borders, {style: borderStyle});
borderLayer.addTo(map);

// Windmill density
function getDensityColor(density){
  // console.log(density);
  return density > 400 ? '#ff0000':
          density > 300 ? '#ff6060':
          density > 200 ? '#ff8888':
          density > 100 ? '#ffa7a7':
          density > 50 ? '#ffc1c1':
          density > 25 ? '#ffd8d8': 
          '#ffecec';
}
function styleDensity(feature) {
  return {
      fillColor: getDensityColor(feature.properties.NUMPOINTS),
      weight: 1,
      opacity: 1,
      color: 'black',
      dashArray: '3',
      fillOpacity: 0.7
  };
}
// Density layer interactions
var densityInfo = L.control({position: "topleft"});
densityInfo.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'density--info'); // create a div with a class "info"
  this.update();
  return this._div;
};
densityInfo.update = function (props) {  
  console.log(props);
  this._div.innerHTML = '<h4 class="density--info-header">Molen dichtheid</h4><p class="denstity--info-text">' +  (props ?
    '<b>' + props.Provincien + '</b><br />' + props.NUMPOINTS + ' Molens in deze provincie'
    : 'Hover over of klik op een provincie met de dichtheidsfilter aan om hier het aantal molens te zien');	
  };
densityInfo.addTo(map);
// console.log(densityInfo)
function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({
      weight: 5,
      color: '#1E1B18',
      dashArray: '',
      fillOpacity: 0.7
  });
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
  densityInfo.update(layer.feature.properties);
}
function resetHighlight(e) {
  densityLayer.resetStyle(e.target);
  densityInfo.update();
}
function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}
function onEachFeatureDensity(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}
const densityLayer = L.geoJson(density, {
  style: styleDensity, 
  onEachFeature: onEachFeatureDensity
});
const slider = document.getElementById("density");
slider.addEventListener("click", function(){
  if(slider.checked){
    if(map.hasLayer(molenLayer)){
      map.removeLayer(molenLayer);
    }
    if(map.hasLayer(molenClusters)){
      map.removeLayer(molenClusters);
    }
    if(map.hasLayer(filterLayer)){
      map.removeLayer(filterLayer);
    }
    if(map.hasLayer(filterClusters)){
      map.removeLayer(filterClusters);
    }
    densityLayer.addTo(map);
  }
  else{
    densityLayer.removeFrom(map);
    fixZoom();
  }
});

// Additional control place holders
function addControlPlaceholders(map) {
  let corners = map._controlCorners,
      l = 'leaflet-',
      container = map._controlContainer;
  function createCorner(vSide, hSide) {
      let className = l + vSide + ' ' + l + hSide;
      corners[vSide + hSide] = L.DomUtil.create('div', className, container);
  }
  createCorner('verticalcenter', 'left');
  createCorner('verticalcenter', 'right');
}
addControlPlaceholders(map);
  
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

// Legenda
let legendButton = L.control({position: 'topright'});
legendButton.onAdd= function(){
  let legendButtonDiv = L.DomUtil.create('div', 'legend--button-container');
  legendButtonDiv.innerHTML += "<button class='legend--button' id='legend_button' onmousedown='toggleLegend()' >Verberg legenda</button>";
  return legendButtonDiv
}
legendButton.addTo(map);

let legend = L.control({position: 'verticalcenterright'});
let showLegend = true;

legend.onAdd = function(){
  let legendDiv = L.DomUtil.create('div', 'legend');
  legendDiv.setAttribute("id", "legend");
  legendDiv.innerHTML += "<h3 class='legend--header'>Legenda</h3>";
  // Clusters
  legendDiv.innerHTML += "<h5 class='legend--header-2'>Cluster indicatie</h5>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='windmill__icon windmill__icon--green legend--icon'></div><p class='legend--text'>Tot " + lowCount + " Molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='windmill__icon windmill__icon--yellow legend--icon'></div><p class='legend--text'>"+ lowCount + " tot " + low_medCount + " molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='windmill__icon windmill__icon--orange legend--icon'></div><p class='legend--text'>"+ low_medCount + " tot " + med_highCount + " molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='windmill__icon windmill__icon--red legend--icon'></div><p class='legend--text'>Vanaf " + med_highCount + " molens</p>";
  // Hoofdfuncties
  legendDiv.innerHTML += "<h5 class='legend--header-2'>Hoofdfunctie molens</h5>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--purple legend--icon'></div><p class='legend--text'>Industriemolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--pink legend--icon'></div><p class='legend--text'>Koren/industriemolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--orange legend--icon'></div><p class='legend--text'>Koren/zaagmolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--red legend--icon'></div><p class='legend--text'>Korenmolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--blue legend--icon'></div><p class='legend--text'>Poldermolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--green legend--icon'></div><p class='legend--text'>Zaagmolen</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend__windmill_icon--brown legend--icon'></div><p class='legend--text'>Onbekende molen</p>";
  // Density
  legendDiv.innerHTML += "<h5 class='legend--header-2 ' id='legend--density'>Dichtheid per provincie</h5>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(0) + "'></div> <p class='legend--text'>0 tot 25 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(26) + "'></div> <p class='legend--text'>25 tot 50 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(51) + "'></div> <p class='legend--text'>50 tot 100 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(101) + "'></div> <p class='legend--text'>100 tot 200 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(201) + "'></div> <p class='legend--text'>200 tot 300 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(301) + "'></div> <p class='legend--text'>300 tot 400 molens</p>";
  legendDiv.innerHTML += "<section class='legend--section'><div class='legend--color-density' style='background: " + getDensityColor(401) + "'></div> <p class='legend--text'>Meer dan 400 molens</p>";


  return legendDiv
}
legend.addTo(map);
toggleLegend();

function toggleLegend(){
  if(showLegend){
    document.getElementById("legend").style.display = "block";
    document.getElementById("legend_button").innerHTML = "Verberg legenda";
    showLegend = false;
  }
  else{
    document.getElementById("legend").style.display = "none";
    document.getElementById("legend_button").innerHTML = "Toon legenda";
    showLegend = true;
  }
}

let molenLayer = L.geoJSON(molens, {
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
// Clusters for main molen layer
let molenClusters = new L.markerClusterGroup({
  iconCreateFunction: function(cluster){
    let childCount = cluster.getChildCount();
    if(childCount <= lowCount){
      windmillBackground = "windmill__icon--green";
    }else if(childCount > lowCount && childCount <= low_medCount){
      windmillBackground = "windmill__icon--yellow";
    }else if(childCount > low_medCount && childCount <= med_highCount){
      windmillBackground = "windmill__icon--orange";
    }else if(childCount > med_highCount){
      windmillBackground = "windmill__icon--red";    }
    
    let html = '<div class="windmill__icon"> <p class="windmill__icon--text">' + childCount + '</p></div>';

    return L.divIcon({ html: html, className: 'windmill__cluster ' + windmillBackground, iconSize: L.point(32, 32)});
    
  },
  spiderfyOnMaxZoom: false, showCoverageOnHover: true, zoomToBoundsOnClick: true, animateAddingMarkers: true
}).addLayer(molenLayer);

// Load right layer on opening site
if(map.getZoom() >= zoomMin_to_molenLayer){
  map.addLayer(molenLayer);
}
else if(map.getZoom() <= zoomMax_to_molenClusters){
  map.addLayer(molenClusters);
}
// TODO Fix center marker popup on click 
map.on('popupopen', function(e) {
  let px = map.project(e.target._popup._latlng); // find the pixel location on the map where the popup anchor is
  px.y -= e.target._popup._container.clientHeight/2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
  map.panTo(map.unproject(px),{animate: true}); // pan to new center
});

// Update on filter to apply correct layer 
let filterLayer = new L.geoJSON(); 
let filterClusters = new L.markerClusterGroup();
function updateOnFilter(){
  if(filterClusters !== undefined){
    filterClusters.clearLayers();
  }
  if(filterLayer !== undefined){
    filterLayer.clearLayers();
  }
  let enabledTypeFilters = {};
  let enabledStateFilters = {};

  const typeCheckboxes = document.getElementsByClassName("filter--windmillType");
  const stateCheckboxes = document.getElementsByClassName("filter--windmillState");

  if(!document.getElementById("windmills--all").checked || !document.getElementById("status--all".checked)){    // Check wheter all windmills are checked
    // console.log("Not all windmills are checked");
    map.removeLayer(molenLayer);    // Remove all windmills (main layer) if not
    map.removeLayer(molenClusters);   // Remove cluster on main layer
    for(let i = 0; i < typeCheckboxes.length; i++){   // Loop through all typeCheckboxes
      if(typeCheckboxes[i].checked){    // Check if checkbox is checked
        enabledTypeFilters[typeCheckboxes[i].value] = true;   // Add checkbox value to enabledTypeFilters object
      }      
    }
    for(let i = 0; i < stateCheckboxes.length; i++){   // Loop through all stateCheckboxes
      if(stateCheckboxes[i].checked){    // Check if checkbox is checked
        enabledStateFilters[stateCheckboxes[i].value] = true;   // Add checkbox value to enabledStateFilters object
      }      
    }
    filterLayer = L.geoJSON(molens, {  // Create new layer with filtered data 
      onEachFeature: function(feature, layer){    // Loop through all features
        if(feature.properties.HFDFUNCTIE in enabledTypeFilters && feature.properties.STAAT in enabledStateFilters){    // Check if feature is in enabled[]Filters
          layer.bindPopup("<h3 class='popup__naam'>" + feature.properties.NAAM + "</h3>"    // Add popup
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
        }
      },
      pointToLayer: function(feature, latlng){    // Add marker to layer
        if(feature.properties.HFDFUNCTIE in enabledTypeFilters && feature.properties.STAAT in enabledStateFilters){
          return L.marker(latlng, {icon: getColor(feature.properties.HFDFUNCTIE)});
        }
      }
    }).addTo(map);
    // update clusters
  filterClusters = L.markerClusterGroup({
    iconCreateFunction: function(cluster){
      let childCount = cluster.getChildCount();
      if(childCount <= lowCount){
        windmillBackground = "windmill__icon--green";
      }else if(childCount > lowCount && childCount <= low_medCount){
        windmillBackground = "windmill__icon--yellow";
      }else if(childCount > low_medCount && childCount <= med_highCount){
        windmillBackground = "windmill__icon--orange";
      }else if(childCount > med_highCount){
        windmillBackground = "windmill__icon--red";    }
      
      let html = '<div class="windmill__icon"> <p class="windmill__icon--text">' + childCount + '</p></div>';
  
      return L.divIcon({ html: html, className: 'windmill__cluster ' + windmillBackground, iconSize: L.point(32, 32)});
      
    },
    spiderfyOnMaxZoom: false, showCoverageOnHover: true, zoomToBoundsOnClick: true, animateAddingMarkers: true
  }).addLayer(filterLayer);
  }else{    // If all windmills are checked
    map.removeLayer(filterLayer);   // Remove filtered layer
    map.addLayer(molenLayer);   // Add main layer
  }  
  // console.log(enabledTypeFilters);
  // console.log(enabledStateFilters);
  fixZoom();
  
}

// point to correct layer on zooming in or out
map.on('zoom', function(){
  // console.log(map.getZoom());
  fixZoom();
});
// Use correct zoom layer on zooming in or out or filter update
function fixZoom(){
  if(!slider.checked){
    if(map.getZoom() >= zoomMin_to_molenLayer){
      if(document.getElementById("windmills--all").checked == true){
        // remove filter layers
        map.removeLayer(filterLayer);
        map.removeLayer(filterClusters);
        // remove main cluster layer
        map.removeLayer(molenClusters);
        // add main layer
        map.addLayer(molenLayer);
      }
      // if windmills--all not checked add filter layers
      else if(document.getElementById("windmills--all").checked == false){
        // remove main layers
        map.removeLayer(molenLayer);
        map.removeLayer(molenClusters);
        // remove filter clusters
        map.removeLayer(filterClusters);
        // add filter layer
        map.addLayer(filterLayer);
      }
    }
    else if(map.getZoom() <= zoomMax_to_molenClusters){
      if(document.getElementById("windmills--all").checked == true){
        // remove filter layers
        map.removeLayer(filterLayer);
        map.removeLayer(filterClusters);
        // remove main layer
        map.removeLayer(molenLayer);
        // add main cluster layer
        map.addLayer(molenClusters);
      }
      // if windmills--all not checked add filter cluster layer
      else if(document.getElementById("windmills--all").checked == false){
        // remove main layers
        map.removeLayer(molenLayer);
        map.removeLayer(molenClusters);
        // remove filter layer
        map.removeLayer(filterLayer);
        // add filter cluster layer
        map.addLayer(filterClusters);
      }
    }
  }
}

// Navigation control
function openNav() {
  document.getElementById("sideNav").classList.add("sideNav__open");
}
function closeNav() {
  document.getElementById("sideNav").classList.remove("sideNav__open");
}
// Filter controll
// if radiobutton for all is checked, check all radio buttons for type of molen and status
document.getElementById("windmills--all").addEventListener("click", function(){filterAll("windmills--all", "filter--windmillType")});
document.getElementById("status--all").addEventListener('click', function(){filterAll("status--all", "filter--windmillState")});
function filterAll(id, className){
  allBoxes = document.getElementsByClassName(className);
  if(document.getElementById(id).checked){
    for(i = 0; i < allBoxes.length; i++){
      allBoxes[i].checked = true;
    }
  }else if(!document.getElementById(id).checked){
    for(i = 0; i < allBoxes.length; i++){
      allBoxes[i].checked = false;
    }
  }
  updateOnFilter();
}
// if any radiobutton is unclicked, uncheck  radio buttons for windmills--all
const allWindmillBoxes = document.getElementsByClassName("filter--windmillType");
for(box = 0; box < allWindmillBoxes.length; box++){
  allWindmillBoxes[box].addEventListener("click", function(){checkAll("windmills--all", "filter--windmillType")});
}
const allStatusBoxes = document.getElementsByClassName("filter--windmillState");
for(box = 0; box < allStatusBoxes.length; box++){
  allStatusBoxes[box].addEventListener("click", function(){checkAll("status--all", "filter--windmillState")});
}
function checkAll(id, className){
  allBoxes = document.getElementsByClassName(className);
  checkCount = 0;
  for(i = 0; i < allBoxes.length; i++){
    if(allBoxes[i].checked){
      checkCount++;
    }
  }
  if(checkCount != allBoxes.length){
    document.getElementById(id).checked = false;
  }else if(checkCount == allBoxes.length){
    document.getElementById(id).checked = true;
  }
  updateOnFilter();
}

// Routing to windmills
function makeSearchQuery(featureName){
  // Custom search qeury to google maps for directions to location
  featureName = featureName.replace(/ /g,"+");
  featureName = "Molen+" + featureName;
  searchQuery = "https://www.google.nl/maps/dir//" + featureName;
  return searchQuery;
}

