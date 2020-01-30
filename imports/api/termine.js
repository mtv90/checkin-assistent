import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email'
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
export const Termine = new Mongo.Collection('termine');
import { check } from 'meteor/check'

if(Meteor.isServer){
    

    Meteor.publish(null, () => {
        if(this.userId && Roles.userIsInRole(this.userId, 'admin')){
            const user_id = this.userId;
            const role = Roles.userIsInRole(this.userId, 'admin');

        
            // Meteor.setInterval(() => {
            //     termine = Termine.find({$and: [{"praxis.mitarbeiter._id": user_id}, 
            //     {"checkedIn": false} ]}).fetch();
            //     console.log('Daten aktualisiert!');
            // }, 360000);
            
            
                
            Meteor.setInterval(function() {
                const termine = Termine.find({$and: [{"praxis.mitarbeiter._id": user_id}, 
                    {"checkedIn": false} ]}).fetch();
                    termine.map(termin => {
                        console.log(moment().diff(termin.start, "minutes"))
                        if(moment().diff(termin.start, "minutes") >= -118 && moment().diff(termin.start, "minutes") <= -123){
                            console.log(termin.start, moment().diff(termin.start, "minutes"));

                        }
                        console.log('Daten aktualisiert!');
                    });
            }, 300000);
            
        }
    })

    Meteor.publish(
        'termine', function (){
            return Termine.find({user_id: this.userId});
    });
    Meteor.publish(
        'termineWaiting', function (){
            return Termine.find({$and: [ { user_id: this.userId }, { checkedIn: true }, { start: {$gte: moment().format('YYYY-MM-DD') } } ]});
        }
    );
    Meteor.publish(
        'termineToday', function (){
            return Termine.find({$and: [ { checkedIn: false }, { start: {$gte: moment().format('YYYY-MM-DD') } } ]});
        }
    );
    Meteor.publish(
        'termineWaitingToday', function (){
            return Termine.find({$and: [ { checkedIn: true }, { start: {$gte: moment().format('YYYY-MM-DD') } } ]});
        }
    );
    Meteor.publish(
        'patiententermine', function() {
            return Termine.find({'patient._id': this.userId}, {sort: {start: 1}});
            // Termine.find({ $query: {"patient._id": this.userId}, $orderby: { start : 1 } });
        }
    );
}

Meteor.methods({

    'termine.insert'( 
        patient_id,
        start,
        end,
        subject,
        notes,
        praxis
        ){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        if(!patient_id){
            throw new Meteor.Error('Ungültige Eingabe! Es wurde kein Patient ausgewählt.');
        }
        new SimpleSchema({
            patient_id: {
                type: String,
                label: 'Patient',
                min: 1,
                max: 400,
                optional:false
            },
            subject:{
                type: String,
                label: 'Betreff',
                max: 200,
                optional:false
            },
            notes: {
                type: String,
                label: 'Bemerkungen',
                max: 1000,
                optional:true
            }
        }).validate({patient_id, subject, notes});

        const patient = Meteor.users.findOne({_id: patient_id}, {fields:{services: 0, role: 0, createdAt: 0}});
        if(patient){
            let title = `${patient.profile.nachname}, ${patient.profile.vorname}` 
        
            return Termine.insert({
                title,
                patient,
                subject,
                start,
                end,
                notes,
                praxis,
                checkedIn: false,
                status: 'open',
                patientRead: false,
                adminRead:true,
                user_id: this.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

    },

    'termine.remove'(_id) {
        if(!this.userId) {
            throw new Meteor.Error('Nicht authorisiert!');
        }
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            }
        }).validate({_id});

        return Termine.remove({
            _id,
            user_id: this.userId
        });
    },

    'termin.check'(_id, termin) {
        const checkAccess = Termine.findOne(_id)
        
        let mitarbeiter_access = false;         
        
        if(!this.userId) {
            throw new Meteor.Error('Nicht authorisiert!');
        }
        // Prüfe, ob der Benutzer ein Praxismitarbeiter ist 
        checkAccess.praxis.mitarbeiter.map( (mitarbeiter) => {
            if(mitarbeiter._id === this.userId){
                mitarbeiter_access = true;
                return true;
            } else {
                mitarbeiter_access = false;
                return false;
            }
        });

        // Prüfe, ob der Benutzer der entsprechende Patient ist 
        if(checkAccess.patient._id === this.userId ||  checkAccess.user_id === this.userId || mitarbeiter_access){
            const checkedIn = termin.checkedIn;
            const status = termin.status;
            const patientRead = termin.patientRead;
            const adminRead = termin.adminRead;
            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                },
                checkedIn: {
                    type: Boolean,
                    allowedValues: [true, false]
                },
                patientRead: {
                    type: Boolean,
                    allowedValues: [true, false]
                },
                adminRead: {
                    type: Boolean,
                    allowedValues: [true, false]
                },
                status: {
                    type: String,
                    allowedValues: ['open', 'waiting', 'in-behandlung', 'abgeschlossen', 'storniert', 'gesperrt', 'verspaetet']
                }
            }).validate({_id, checkedIn, status, patientRead, adminRead});
    
           return Termine.update({
                _id,
                user_id: termin.user_id
            },{
                $set: {
                    ...termin,
                    updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    
                }
            }); 
        } else {
            throw new Meteor.Error('Sie dürfen keine Status-Updates durchführen');
        }

    },

    'termin.update'(_id, termin){
        let found = termin.praxis.mitarbeiter.map( user => {
            user._id === this.userId ? true : false;
        })
        if(!this.userId && !found) {
            throw new Meteor.Error('Nicht authorisiert!');
        }

        if(termin){
            // Bestätigungsmail versenden 
            
            let to = termin.patient.emails[0].address;
            let from = `${termin.praxis.title}-Checkin <app151404387@heroku.com>`;
            let subject = termin.subject;
            

            return Termine.update({
                _id,
            },{
                $set: {
                    ...termin,
                    updatedBy: this.userId,
                    updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss')
                }
            });
        } else {
            throw new Meteor.Error('Es konnte kein Termin gefunden und aktualisiert werden');
        }

    },
    'termin.update_mail'(to, myName, subject, termin){
        if(termin){
            const from = `${myName}-Checkin <app151404387@heroku.com>`;
            const text = `Hallo ${termin.patient.profile.vorname} ${termin.patient.profile.nachname},\n\ \n\ \n\Es gibt Veränderungen bzgl. Ihres Termins:\n\ \n\Status: ${termin.status}\n\ \n\ Datum: ${moment(termin.start).format('dd DD.MM.YYYY HH:mm')} Uhr bis ${moment(termin.end).format('DD.MM.YYYY HH:mm')} Uhr\n\ \n\Grund: ${termin.subject}\n\ \n\Hinweise: ${termin.notes}\n\ \n\Stornierungsgrund: ${termin.stornoGrund}\n\ \n\Kontakt: ${termin.praxis.title}, ${termin.praxis.strasse} ${termin.praxis.nummer}, ${termin.praxis.plz} ${termin.praxis.stadt}\n\ \n\Telefon: ${termin.praxis.telefon}, E-mail: ${termin.praxis.email}\n\ \n\ \n\Bei weiterführenden Fragen wenden Sie sich bitte an den oben genannten Kontakt.\n\ \n\Ihr Praxis-Team!`
            
            process.env.MAIL_URL="smtp://app151404387@heroku.com:xcpw0h707834@smtp.sendgrid.net:587";
            // Make sure that all arguments are strings.
            check([to, from, subject, text], [String]);
            // Let other method calls from the same client start running, without
            // waiting for the email sending to complete.
            this.unblock();
            Email.send({to, from, subject, text});
        }
    }
});
