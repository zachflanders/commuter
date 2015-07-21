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
