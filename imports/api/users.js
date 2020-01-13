import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';

export const validateNewUser = (user) => {
    const email = user.emails[0].address;
    const vorname = user.profile.vorname;
    const nachname = user.profile.nachname;
    const role = user.role;

    new SimpleSchema({
      vorname: {
        type: String,
        max: 150
      },
      nachname: {
        type: String,
        max: 150
      },
      email: {
        type: String,
        regEx: SimpleSchema.RegEx.EmailWithTLD
      },
      role: {
        type: String,
        max: 150
      }
    }).validate({vorname, nachname, email, role })
    Roles.addUsersToRoles(user._id, [role])
    return true;
}

// Benutzer-Validierung
if(Meteor.isServer) {
    
    Accounts.validateNewUser(validateNewUser);

    Accounts.onCreateUser(function(options, user) {

      user.profile = options.profile || {};
      //Basic Role Set Up
      user.role = options.role || [];
  
      // Returns the user object
      return user;
    });

    
    Meteor.publish(null, function () {
      if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
      } else {
        this.ready()
      }
    });
      
    Meteor.publish('userList', function (){ 
      
      const role = Roles.userIsInRole(this.userId, 'admin')
      if(role){
        return Meteor.users.find({role: "patient"});
      } else {
        throw new Meteor.Error('Sie haben keine Rechte');
      }
 
    });

    Meteor.publish('mitarbeiter', function (){ 
      
      const role = Roles.userIsInRole(this.userId, 'admin')
      if(role){
        return Meteor.users.find({role: "admin"});
      } else {
        throw new Meteor.Error('Sie haben keine Rechte');
      }
 
    });

    Meteor.publish('user', function() {
      if(this.userId) {
        return Meteor.users.find({_id: this.userId});
      } else {
        throw new Meteor.Error('Sie haben keine Rechte');
      }
    });

    Meteor.publish('patient', function() {
      if(this.userId) {
        if(Roles.userIsInRole(this.userId, 'patient')) {
          return Meteor.users.find({$and: [ {_id: this.userId}, {role: 'patient'} ]});
        } else {
          throw new Meteor.Error('Benutzer hat nicht die richtige Benutzerrolle!');
        }
        
      } else {
        throw new Meteor.Error('Sie haben keine Rechte');
      }
    })
}

// Versende eine VerifizierungsMail an die angegebene Adresse
// diese Methode muss noch explizit aufgerufen werden! Siehe Signup.js 
Meteor.methods({
    'sendeEmail'(email, role) {
   
      process.env.MAIL_URL="smtp://app151404387@heroku.com:xcpw0h707834@smtp.sendgrid.net:587";

        if(!this.userId){
            throw new Meteor.Error('Es ist kein Benutzer vorhanden');
        }
        // let mail = email;
        // if(!mail) {
        //   const user = Meteor.users.findOne({_id: this.userId});
        //   mail = user.emails[0].address
        // }
        Accounts.emailTemplates.siteName = 'Dein Checkin-Assistent';
        Accounts.emailTemplates.from = 'Checkin-Assistent<app151404387@heroku.com>';
        Accounts.emailTemplates.verifyEmail = {
            subject() {
               return "Aktivieren Sie jetzt Ihren Account!";
            },
            text(user, url) {
               return `Hey! Schön, dass Sie unseren Service nutzen möchten. Damit dies vollumfänglich möglich ist, bestätigen Sie bitte Ihre Email unter folgendem Link: ${url}`;
            }
         };
        Accounts.sendVerificationEmail(this.userId, email);
    },

    'resentEmail'() {
      const user = Meteor.users.findOne({_id: this.userId});
      if (user.emails[0].address) {
        process.env.MAIL_URL="smtp://app151404387@heroku.com:xcpw0h707834@smtp.sendgrid.net:587";
        let email = user.emails[0].address;
        Accounts.emailTemplates.siteName = 'Dein Checkin-Assistent';
        Accounts.emailTemplates.from = 'Checkin-Assistent<app151404387@heroku.com>';
        Accounts.emailTemplates.verifyEmail = {
            subject() {
               return "Aktivieren Sie jetzt Ihren Account!";
            },
            text(user, url) {
               return `Hey! Schön, dass Sie unseren Service nutzen möchten. Damit dies vollumfänglich möglich ist, bestätigen Sie bitte Ihre Email unter folgendem Link: ${url}`;
            }
         };
        Accounts.sendVerificationEmail(user._id, email);
      }
      else {
        throw new Meteor.Error('Es ist ein Fehler beim Senden aufgetreten!');
      }
    }

});