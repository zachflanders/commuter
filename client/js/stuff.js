$( document ).ready(function(){
  $(".button-collapse").sideNav();
});


Meteor.subscribe("activities");


Template.addActivity.rendered = function() {
  var layer;
  var map = L.map('map').locate({setView:true});;
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

Template.dashboard.rendered = function() {
  var week = moment().subtract(7, 'days');
  var data = Activities.find({owner: Meteor.userId()}).fetch();
  var totalLength = 0;
  for(var prop in data){
    console.log(data[prop]);
    console.log(moment(data[prop].createdAt) >= week);
    if(moment(data[prop].createdAt) >= week){
      totalLength = totalLength + turf.lineDistance((L.polyline(data[prop].route).toGeoJSON()),'miles');
    }
  }
  $('#dashboard').html(
    "<div class='card'>"+
      "<div class='card-content'>"+
        "<span class='card-title grey-text text-darken-4'>Previous 7 days</span>"+
        "<br>Total distance: " + numeral(totalLength).format('0,0.00') + "</div></div>"
  );
};
