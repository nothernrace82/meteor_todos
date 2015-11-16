Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
//   // counter starts at 0
//   Session.setDefault('counter', 0);

//   Template.hello.helpers({
//     counter: function () {
//       return Session.get('counter');
//     }
//   });

//   Template.hello.events({
//     'click button': function () {
//       // increment the counter when button is clicked
//       Session.set('counter', Session.get('counter') + 1);
//     }
//   });
// }

// if (Meteor.isServer) {
//   Meteor.startup(function () {
//     // code to run on server at startup
//   });  

  Template.body.helpers({
    tasks: function() {
      return Tasks.find({}, { sort: {createdAt: -1} });
    }
  });
  
  Template.body.events({
    'submit .new-task': function(event) {
      event.preventDefault();

      var text = event.target.text.value;

      Tasks.insert({
        text: text,
        createdAt: new Date()
      });

      event.target.text.value = "";
    }
  });
}
