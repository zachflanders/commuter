Template.dashboard.rendered = function() {
  var week = moment().subtract(7, 'days');
  var data = Activities.find({owner: Meteor.userId()}).fetch();
  var totalLength = 0;
  var points = [];
  for(var prop in data){
    var distance = 0;
    if(moment(data[prop].createdAt) >= week){
      distance = turf.lineDistance((L.polyline(data[prop].route).toGeoJSON()),'miles');
      totalLength = totalLength + distance;
      for(var i = 0; i<= distance; i+=0.01){
        points.push([turf.along(L.polyline(data[prop].route).toGeoJSON(), i, 'miles').geometry.coordinates[1], turf.along(L.polyline(data[prop].route).toGeoJSON(), i, 'miles').geometry.coordinates[0]] );
      }
    }
  }
  console.log(points);
  var map = L.map('heatmap').locate({setView:true});;
  L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);
  L.heatLayer(points, {radius: 9}).addTo(map);

  $('#dashboard').html(
    "<div class='card'>"+
      "<div class='card-content'>"+
        "<span class='card-title grey-text text-darken-4'>Previous 7 days</span>"+
        "<br>Total distance: " + numeral(totalLength).format('0,0.00') + "</div></div>"
  );
};
