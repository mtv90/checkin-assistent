import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';


export const validateNewUser = (user) => {
    const email = user.emails[0].address;
    const vorname = user.profile.vorname;
    const nachname = user.profile.nachname;
    const role = user.role;
    process.env.MAIL_URL="smtps://maik.tranvan%40gmail.com:dygtivgi@smtp.gmail.com:465/";
  
    console.log(role)
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
      // console.log(options)
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
  
}

// Versende eine VerifizierungsMail an die angegebene Adresse
// diese Methode muss noch explizit aufgerufen werden! Siehe Signup.js 
Meteor.methods({
    'sendeEmail'(email, role) {
      process.env.MAIL_URL="smtps://maik.tranvan%40gmail.com:dygtivgi@smtp.gmail.com:465/";
        if(!this.userId){
            throw new Meteor.Error('Es ist kein Benutzer vorhanden');
        }
        Accounts.emailTemplates.siteName = 'Dein Checkin-Assistent';
        Accounts.emailTemplates.from = 'Checkin-Assistent<maik.tranvan@gmail.com>';
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

    // 'checkRole'(userId)
    // {
    //   if(!userId){
    //     throw new Meteor.Error('Es ist kein Benutzer vorhanden');
    //   }
    //   Meteor.publish(null, function () {
    //     if (userId) {
    //       return Meteor.roleAssignment.find({ 'user._id': userId });
    //     } else {
    //       this.ready()
    //     }
    //   });
    // }
});