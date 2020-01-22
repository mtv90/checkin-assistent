import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
export const Praxen = new Mongo.Collection('praxen');

if(Meteor.isServer){
    Meteor.publish(
        'praxen', function() {
            return Praxen.find({$or:[{user_id: this.userId}, {mitarbeiter: {$elemMatch: {_id: this.userId}}}]});
            
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
        openings,
        resources,
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
                type: String,
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
            },
            resources: {
                type: Array,
                label: 'Ressourcen',
                optional: true
            },
            'resources.$':{
                type: Object,
                label: 'Ressource',
                optional: true
            },
            'resources.$.title':{
                type: String,
                label: 'Name',
                optional: true
            },
            'resources.$.id':{
                type: String,
                label: 'Ressource-ID',
                optional: true
            },
            openings:{
                type: Array,
                label: 'Öffnungszeiten',
                optional: true
            },
            'openings.$': {
                type: Object,
                label: 'Öffnungszeit',
                optional: true
            },
            'openings.$.day': {
                type: String,
                label: 'Tag',
                optional: true
            },
            'openings.$.start':{
                type: String,
                label: 'Startzeit',
                optional: true,
            },
            'openings.$.end':{
                type: String,
                label: 'Endzeit',
                optional: true
            }
            }).validate({
                title,
                strasse,
                nummer,
                plz,
                telefon,
                email,
                stadt,
                openings,
                resources
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
                openings,
                resources,
                user_id: this.userId,
                updatedBy: this.userId,
                createdAt: new Date(),
                updatedAt: new Date()
            });
    },

    'praxis.update'(_id, updates, patienten) {
        if(!this.userId){
            throw new Meteor.Error('Sie sind nicht authorisiert!');
        }
        new SimpleSchema({
            _id: {
                type: String,
                min: 1
            },
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
                type: String,
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
            },
            user_id: {
                type: String,
                label: 'UserID',
            },
            createdAt: {
                type: Date,
                label: 'createdAt'
            },
            updatedAt: {
                type: Date,
                label: 'updatedAt',
                optional: true
            },
            updatedBy:{
                type: String,
                label: 'Updated By',
                optional: true,
            },
            mitarbeiter: {
                type: Array,
                required: false,
                optional: true
            },
            'mitarbeiter.$':{
                type: Object,
                required: false,
                optional: true
            },
            'mitarbeiter.$._id': {type: String, required: false},
            'mitarbeiter.$.role': {type: String, optional: true},
            'mitarbeiter.$.label': {type: String, optional: true},
            'mitarbeiter.$.value': {type: String, optional: true},
            'mitarbeiter.$.profile': {type:Object, optional: true},
            'mitarbeiter.$.profile.vorname': {type: String, optional: true},
            'mitarbeiter.$.profile.nachname': {type: String, optional: true},
            'mitarbeiter.$.createdAt': {type: Date, optional: true},
            'mitarbeiter.$.updatedAt': {type: Date, optional: true},
            'mitarbeiter.$.emails': {type: Array, optional: true},
            'mitarbeiter.$.emails.$': {type:Object, optional: true},
            'mitarbeiter.$.emails.$.address': {type: String, optional: true},
            'mitarbeiter.$.emails.$.verified': Boolean,
            openings:{
                type: Array,
                label: 'Öffnungszeiten',
                optional: true
            },
            'openings.$': {
                type: Object,
                label: 'Öffnungszeit',
                optional: true
            },
            'openings.$.day': {
                type: String,
                label: 'Tag',
                optional: true
            },
            'openings.$.start':{
                type: String,
                label: 'Startzeit',
                optional: true,
            },
            'openings.$.end':{
                type: String,
                label: 'Endzeit',
                optional: true
            },
            resources: {
                type: Array,
                label: 'Ressourcen',
                optional: true
            },
            'resources.$':{
                type: Object,
                label: 'Ressource',
                optional: true
            },
            'resources.$.title':{
                type: String,
                label: 'Titel',
                optional: true
            },
            'resources.$.id':{
                type: String,
                label: 'Ressource-ID',
                optional: true
            },
            patienten: {
                type: Array,
                optional: true
            },
            'patienten.$':  {
                type: Object,
                optional: true
            },
            'patienten.$._id':  {
                type: String,
                optional: true
            },
            'patienten.$.role':  {
                type: String,
                optional: true
            },
            'patienten.$.label':  {
                type: String,
                optional: true
            },
            'patienten.$.value':  {
                type: String,
                optional: true
            },
            'patienten.$.emails': {
                type: Array,
                optional: true
            },
            'patienten.$.createdAt': {
                type: Date,
                optional: true
            },
            'patienten.$.emails.$': {
                type: Object,
                optional: true
            },
            'patienten.$.emails.$.address': {
                type: String,
                optional: true
            },
            'patienten.$.emails.$.verified': {
                type: Boolean,
                optional: true
            },
            'patienten.$.profile': {
                type: Object,
                optional: true
            },
            'patienten.$.profile.vorname': {
                type: String,
                optional: true
            },
            'patienten.$.profile.nachname': {
                type: String,
                optional: true
            }
        }).validate({
            _id,
            ...updates
        });

        Praxen.update({
            _id,
            user_id: this.userId
        },{
            $set: {
                updatedAt: new Date(),
                updatedBy: this.userId,
                ...updates
            }
        });
    }
});