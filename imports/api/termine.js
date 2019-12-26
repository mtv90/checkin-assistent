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

    'termine.insert'(titel){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        if(!titell){
            throw new Meteor.Error('Ungültige Eingabe! Titel ist notwendig');
        }
        new SimpleSchema({
            titel: {
                type: String,
                label: 'Titel',
                min: 1,
                max: 400,
                optional:false
            }
        }).validate({titel});

        return Termine.insert({
            titel,
            user_id: this.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
});
