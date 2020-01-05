import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Termine = new Mongo.Collection('termine');

if(Meteor.isServer){
    Meteor.publish('termine', function (){
        return Termine.find({user_id: this.userId});
    });
}

Meteor.methods({

    'termine.insert'( 
        patient_id,
        start,
        end,
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
            notes: {
                type: String,
                label: 'Bemerkungen',
                max: 1000,
                optional:true
            }
        }).validate({patient_id, notes});

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
            start,
            end,
            notes,
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
        })
    }
});
