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
    Meteor.publish(
        'show_all', function() {
            return Praxen.find();
        }
    );
    Meteor.publish(
        'meine_praxen', function() {
            
            return Praxen.find({mitarbeiter: {$elemMatch: {_id: this.userId}}});
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
        telefon,
        email,
        mitarbeiter,
        ){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
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
            telefon: {
                type: String,
                label: 'Telefon',
                optional: false
            },
            email: {
                type: SimpleSchema.RegEx.Email,
                label: 'E-mail',
                optional: false
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
                telefon,
                email,
                stadt
            });
            
            return Praxen.insert({
                title,
                strasse,
                nummer,
                plz,
                telefon,
                email,
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