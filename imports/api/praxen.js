import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
export const Praxen = new Mongo.Collection('praxen');

if(Meteor.isServer){
    Meteor.publish(
        'praxen', function() {
            return Praxen.find({user_id: this.userId});
            
        }
    );
}
Meteor.methods({
    'praxis.insert'( 
        title,
        strasse,
        nummer,
        plz,
        stadt,
        mitarbeiter,
        ){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }

            console.log(        
                title,
                strasse,
                nummer,
                plz,
                stadt,
                mitarbeiter)
            
            new SimpleSchema({

                title:{
                    type: String,
                    label: 'Titel',
                    max: 200,
                    optional:false
                },
                strasse: {
                    type: String,
                    label: 'Straße',
                    max: 200,
                    optional:false
                },
                nummer: {
                    type: SimpleSchema.Integer,
                    label: 'Hausnummer',
                    min: 1,
                    optional:false
                },
                plz: {
                    type: SimpleSchema.RegEx.ZipCode,
                    label: 'Postleitzahl',
                    optional:false
                },
                stadt: {
                    type: String,
                    label: 'Stadt',
                    max: 200,
                    optional:false
                }
            }).validate({
                title,
                strasse,
                nummer,
                plz,
                stadt
            });
            
            return Praxen.insert({
                title,
                strasse,
                nummer,
                plz,
                stadt,
                mitarbeiter,
                user_id: this.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });



        // let res = Meteor.users.findOne({_id: patient_id});
        // let patient = {
        //     _id: res._id,
        //     emails: res.emails,
        //     profile: res.profile
        // }
        // let title = `${res.profile.nachname}, ${res.profile.vorname}` 

    },
});