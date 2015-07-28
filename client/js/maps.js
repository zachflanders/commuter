Template.addActivity.rendered = function() {
  var layer;
  var map = L.map('map').locate({setView:true});
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Initialise the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
      circle: false,
      rectangle: false,
      polygon: false,
      marker: false
    }

  });
  map.addControl(drawControl);
  map.on('draw:created', function (e) {
    var type = e.layerType;
      layer = e.layer;
      Session.route=layer._latlngs;
      layer.addTo(drawnItems);


  });
  map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      Session.route = layer._latlngs;
    });
  });



};

Template.map.rendered = function() {
  var data=this.data;
  var id= data._id;

  var map = L.map(id,{
    zoomControl:false,
    dragging:false,
    touchZoom:false,
    scrollWheelZoom:false,
    doubleClickZoom:false,
    boxZoom:false
  });
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);

  var line = L.polyline(data.route).addTo(map);
  var bounds = line.getBounds();
  map.fitBounds(bounds);

};

Template.editMap.rendered = function() {
  var data=this.data;
  var id= data._id;
  var layer;
  var map = L.map(id);
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);

  var line = L.polyline(data.route).addTo(map);
  var bounds = line.getBounds();
  map.fitBounds(bounds);
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);
  layer = line;
  layer.addTo(drawnItems);

  // Initialise the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems
    },
    draw: {
      circle: false,
      rectangle: false,
      polygon: false,
      marker: false
    }

  });
  map.addControl(drawControl);
  map.on('draw:created', function (e) {
    var type = e.layerType;
      layer = e.layer;
      Session.route=layer._latlngs;
      layer.addTo(drawnItems);


  });
  map.on('draw:edited', function (e) {
    var layers = e.layers;
    layers.eachLayer(function (layer) {
      Session.route = layer._latlngs;
    });
  });

};

Template.heatmap.rendered = function() {

  function latlngToArray(latlng){
    var array = [];
    latlng.forEach(function(entry){
      array.push([entry.lat, entry.lng]);
    });
    return array;
  };

  var data=this.data;


  var id= data._id;
  var map = L.map(id+'-heatmap');

  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);
  var line = L.polyline(data.route);
  var bounds = line.getBounds();
  map.fitBounds(bounds);

  var distance = turf.lineDistance(L.polyline(data.route).toGeoJSON(), 'miles');
  var points = []

  for(var i = 0; i<= distance; i+=0.01){
    points.push([turf.along(L.polyline(data.route).toGeoJSON(), i, 'miles').geometry.coordinates[1], turf.along(L.polyline(data.route).toGeoJSON(), i, 'miles').geometry.coordinates[0]] );
  }

  console.log(points, distance);



  L.heatLayer(points, {radius: 15}).addTo(map);

};
