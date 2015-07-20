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

  $( document ).ready(function(){
    $(".button-collapse").sideNav();
  });


  Meteor.subscribe("activities");


/*==========================HELPERS==============================*/

Template.home.helpers({
    activities: function () {
      return Activities.find({}, {sort: {createdAt: -1}});
    }
  });

Template.feed.helpers({
    activities: function () {
        return Activities.find({username: Meteor.user().username}, {sort: {createdAt: -1}});
    }
  });
  Template.showActivity.helpers({
      length: function () {
          return numeral(turf.lineDistance((L.polyline(this.route).toGeoJSON()),'miles')).format('0,0.00');
      }
    });
  Template.activity.helpers({
      length: function () {
          return numeral(turf.lineDistance((L.polyline(this.route).toGeoJSON()),'miles')).format('0,0.00');
      }
    });





/*==========================EVENTS==============================*/

  Template.addActivity.events({
      "submit .new-activity": function (event) {
        // Prevent default browser form submit
        event.preventDefault();


        // Get value from form element
        var name = event.target.name.value;
        var route = Session.route;


        // Insert a task into the collection
        Meteor.call('addActivity', name, route);

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
        var id = this._id;
        console.log(id);
        var route = Session.route;
        Meteor.call('editActivity', id, name, route);

          event.target.name.value = "";
        },
      "click .delete": function () {
        Meteor.call('deleteActivity',this._id);
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
  Router.route('/activity/:_id/', function () {
  var params = this.params;
  var id = params._id;
  this.render('showActivity', {
    data: function () {
      return Activities.findOne({_id: id});
    }});
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
  Router.route('/:username/feed', function () {
    this.render('feed');
  });
  Router.route('/:username/dashboard', function () {
    this.render('dashboard');
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

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("activities", function () {
    return Activities.find();
  });
}

Meteor.methods({
  addActivity: function (name, route) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Activities.insert({
      name: name,
      route: route,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteActivity: function (activityId) {
    var activity = Activities.findOne(activityId);
    if (activity.owner !== Meteor.userId()) {
      // make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Activities.remove(activityId);
  },
  editActivity: function(activityId, name, route){
    var activity = Activities.findOne(activityId);
    if (activity.owner !== Meteor.userId()) {
      // make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Activities.update(activityId, {
        $set: {
          name: name,
          route: route
        }

      });
    }

});
