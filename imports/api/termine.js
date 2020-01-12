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
            return Termine.find({$and: [ { user_id: this.userId }, { checkedIn: false }, { start: {$gte: moment().format('YYYY-MM-DD') } } ]});
        }
    );
    Meteor.publish(
        'patiententermine', function() {
            let data = Termine.find({}, {patient: {
                _id: this.userId
            }})
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
        notes
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

        let res = Meteor.users.findOne({_id: patient_id});
        let patient = {
            _id: res._id,
            emails: res.emails,
            profile: res.profile
        }
        let title = `${res.profile.nachname}, ${res.profile.vorname}` 
        
        return Termine.insert({
            title,
            patient,
            subject,
            start,
            end,
            notes,
            checkedIn: false,
            user_id: this.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
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
        if(!this.userId) {
            throw new Meteor.Error('Nicht authorisiert!');
        }
        const checkedIn = termin.checkedIn;
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            },
            checkedIn: {
                type: Boolean,
                allowedValues: [true, false]
            }
        }).validate({_id, checkedIn});

        Termine.update({
            _id,
            user_id: this.userId
        },{
            $set: {
                ...termin,
                updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
                
            }
        }); 
    }
});
