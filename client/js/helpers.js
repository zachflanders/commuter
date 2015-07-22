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
  Template.heatmap.helpers({
    points: function (){
      return L.polyline(this.route).toGeoJSON();
    }
  })
