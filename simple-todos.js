Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer) {
  Meteor.publish("tasks", function() {
    return Tasks.find();
  });
}

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
  
  Meteor.subscribe("tasks");

  Template.body.helpers({
    tasks: function() {
      if (Session.get("hideCompleted")) {
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else {
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    },
    hideCompleted: function() {
      return Session.get("hideCompleted");
    },
    incompleteCount: function() {
      return Tasks.find({checked: {$ne: true}}).count();
    }
  });
  
  Template.body.events({
    "submit .new-task": function(event) {
      event.preventDefault();

      var text = event.target.text.value;

      // Tasks.insert({
      //   text: text,
      //   createdAt: new Date(),
      //   owner: Meteor.userId(),
      //   username: Meteor.user().username
      // });

      Meteor.call("addTask", text);

      event.target.text.value = "";
    },
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events({
    "click .toggle-checked": function() {
      // Tasks.update(this._id, {
      //   $set: { checked: !this.checked }
      // });
      Meteor.call("setChecked", this._id, !this.checked);
    },
    "click .delete": function() {
      // Tasks.remove(this._id);
      Meteor.call("deleteTask", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function(text) {
    if(!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function(taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked } });
  }
});
