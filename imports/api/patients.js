import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Patients = new Mongo.Collection('patients');

if(Meteor.isServer) {
    Meteor.publish('patients', function() {
        return Patients.find({user_id: this.userId});
    });
}
