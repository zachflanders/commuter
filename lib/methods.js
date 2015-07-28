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

    Router.go('/'+Meteor.user().username+'/feed');
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
