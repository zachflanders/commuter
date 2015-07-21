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
