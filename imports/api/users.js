import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Accounts } from 'meteor/accounts-base';


export const validateNewUser = (user) => {
    const email = user.emails[0].address;
    const vorname = user.profile.vorname;
    const nachname = user.profile.nachname;
    console.log(user.profile.role);
    console.log(user._id);
    process.env.MAIL_URL="smtps://maik.tranvan%40gmail.com:dygtivgi@smtp.gmail.com:465/";
  

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
      }
    }).validate({vorname, nachname, email })
    Roles.addUsersToRoles(user._id, [user.profile.role])
    return true;
}

// Benutzer-Validierung
if(Meteor.isServer) {
    
    Accounts.validateNewUser(validateNewUser)
    
    Meteor.publish(null, function () {
      if (this.userId) {
        return Meteor.roleAssignment.find({ 'user._id': this.userId });
      } else {
        this.ready()
      }
    });

    Meteor.publish('userList', function (){ 
      return Meteor.users.find({profile: {role: 'patient'}});
    });
  
}

// Versende eine VerifizierungsMail an die angegebene Adresse
// diese Methode muss noch explizit aufgerufen werden! Siehe Signup.js 
Meteor.methods({
    'sendeEmail'(email, role) {
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

    'checkRole'(userId)
    {
      if(!userId){
        throw new Meteor.Error('Es ist kein Benutzer vorhanden');
      }
      Meteor.publish(null, function () {
        if (userId) {
          return Meteor.roleAssignment.find({ 'user._id': userId });
        } else {
          this.ready()
        }
      });
    }
});