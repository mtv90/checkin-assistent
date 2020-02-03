import {Meteor} from 'meteor/meteor';
import { Email } from 'meteor/email'
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { check } from 'meteor/check'
import { Random } from 'meteor/random';

export const Konten = new Mongo.Collection('konten');

if(Meteor.isServer){
    Meteor.publish('meinKonto', function(){
        return Konten.find({user_id: this.userId});
        }
    );
}
    

Meteor.methods({

    'konto.insert'(title, profile, kontakt, versicherungsdaten){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        const anrede = profile.anrede;
        const vorname = profile.vorname;
        const nachname = profile.nachname;
        const geburtsdatum = profile.geburtsdatum;

        const telefon = kontakt.telefon;
        const email = kontakt.email
        const strasse = kontakt.anschrift.strasse;
        const nummer = kontakt.anschrift.nummer;
        const plz = kontakt.anschrift.plz;
        const stadt = kontakt.anschrift.stadt;

        const versicherung = versicherungsdaten.versicherung;
        const versicherungsnummer = versicherungsdaten.versicherungsnummer;
        const versichertennummer = versicherungsdaten.versichertennummer;

        const existingKonto = Konten.findOne({user_id: this.userId});
        if(existingKonto){
            throw new Meteor.Error('Es existiert bereits ein Konto')
        }
        new SimpleSchema({
            title: {
                type: String,
                label: 'Titel'
            },
            anrede: {
                type: String,
                label: 'Anrede'
            },
            vorname: {
                type: String,
                label: 'Vorname'
            },
            nachname: {
                type: String,
                label: 'Nachname'
            },
            geburtsdatum: {
                type: String,
                label: 'Geburtsdatum'
            },
            telefon: {
                type: String,
                label: 'Telefon',
                optional: true
            },
            email: {
                type: SimpleSchema.RegEx.Email,
                label: 'E-Mail'
            },
            strasse: {
                type: String,
                label: 'Strasse',
                optional: true
            },
            nummer: {
                type: String,
                label: 'Nummer',
                optional: true
            },
            plz: {
                type: SimpleSchema.RegEx.ZipCode,
                label: 'Postleitzahl',
                optional: true
            },
            stadt: {
                type: String,
                label: 'Stadt',
                optional: true
            },
            versicherung: {
                type: String,
                label: 'Versicherung',
                optional: true
            },
            versicherungsnummer: {
                type: String,
                label: 'Versicherungsnummer',
                optional: true
            },
            versichertennummer: {
                type: String,
                label: 'Versichertennummer',
                optional: true
            },
        }).validate({
            title,
            anrede,
            vorname,
            nachname,
            geburtsdatum,
            telefon,
            email,
            strasse,
            nummer,
            plz,
            stadt,
            versicherung,
            versicherungsnummer,
            versichertennummer});
        const konto = {
                    _id: Random.id(),
                    title,
                    profile,
                    kontakt,
                    versicherungsdaten,
                }
        return Konten.insert({
            kategorien:[
                konto
            ],
            user_id: this.userId,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    },

    'konto.update'(_id, konto){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }

        return Konten.update({
            _id
        },{
            $set:{
                ...konto,
                updatedAt: new Date()
            }
        })

    }
});

