Activities = new Mongo.Collection("activities");
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([{
    _id: 'username',
    type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
},pwd]);


if (Meteor.isClient) {

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

/*==========================HELPERS==============================*/

Template.home.helpers({
    activities: function () {
      return Activities.find({}, {sort: {createdAt: -1}});
    }
  });



/*==========================EVENTS==============================*/

  Template.addActivity.events({
      "submit .new-activity": function (event) {
        // Prevent default browser form submit
        event.preventDefault();


        // Get value from form element
        var name = event.target.name.value;
        console.log(Meteor.user());

        // Insert a task into the collection
        Activities.insert({
          name: name,
          route: Session.route,
          owner: Meteor.userId(),
          username: Meteor.user().username,
          createdAt: new Date() // current time
        });

        // Clear form
        Session.route="";
        event.target.name.value = "";
      }
    });

    Template.editActivity.events({
      "submit .edit-activity": function (event) {
        event.preventDefault();
        console.log(event.target);
        var name = event.target.name.value;
        var route = Session.route;
        Activities.update(this._id, {
            $set: {
              name: name,
              route: route
            }

          });
          event.target.name.value = "";
        },
      "click .delete": function () {
        Activities.remove(this._id);
      }
    });

/*==========================ROUTING==============================*/

  Router.route('/', function () {
    this.render('home');
  });
  Router.route('/activity/add', function () {
    this.render('addActivity');
  });
  Router.route('/logout', function () {
    Meteor.logout();
    this.render('home');
  });
  Router.route('/activity/:_id/edit', function () {
  var params = this.params;
  var id = params._id;
  console.log(Activities.findOne({_id: id}));
  this.render('editActivity', {
    data: function () {
      return Activities.findOne({_id: id});
    }});
  });


/*==========================DA 'SCRIPTS==============================*/
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
