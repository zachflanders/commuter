//Define Activities collection
Activities = new Mongo.Collection("activities");


//Sign in form - Remove email and change to username, change order of fields
var pwd = AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([{
    _id: 'username',
    type: "text",
      displayName: "username",
      required: true,
      minLength: 5,
},pwd]);
