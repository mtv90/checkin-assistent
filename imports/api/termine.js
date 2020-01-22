import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
export const Termine = new Mongo.Collection('termine');

if(Meteor.isServer){
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

        Termine.remove({
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
        checkAccess.praxis.mitarbeiter.map( (mitarbeiter) => {
            if(mitarbeiter._id === this.userId){
                mitarbeiter_access = true;
                return true;
            } else {
                mitarbeiter_access = false;
                return false;
            }
        });


        if(checkAccess.patient._id === this.userId ||  checkAccess.user_id === this.userId || mitarbeiter_access){
            const checkedIn = termin.checkedIn;
            const status = termin.status;
            new SimpleSchema({
                _id: {
                    type: String,
                    min: 1
                },
                checkedIn: {
                    type: Boolean,
                    allowedValues: [true, false]
                },
                status: {
                    type: String,
                    allowedValues: ['open', 'waiting', 'in-behandlung', 'abgeschlossen', 'storniert', 'gesperrt', 'verspaetet']
                }
            }).validate({_id, checkedIn, status});
    
            Termine.update({
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

    }
});
