import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';
import { Termine } from './termine';

export const Behandlungen = new Mongo.Collection('behandlungen');

if(Meteor.isServer){
    Meteor.publish(
        'behandlungen', function (){
            return Behandlungen.find({user_id: this.userId});
    });

    Meteor.publish(
        'getBehandlungsraum', function (){
            return Behandlungen.find({});
    });
}

Meteor.methods({
    'behandlung.insert'(
        id,
        resourceTitle,
        resourceId,
        date
    ){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        new SimpleSchema({
            id:{
                type: String,
                label: 'ID',
                optional: false
            },
            resourceTitle:{
                type: String,
                label: 'Titel',
                optional: false
            },
            resourceId: {
                type: String,
                label: 'Resource-ID'
            },
            date: {
                type: Date,
                label: 'Startzeit'
            }
        }).validate({id, resourceTitle, resourceId, date});
        let termin = Termine.findOne(id)
        const _id = termin._id

        let duration = moment(termin.end).diff(termin.start, 'minutes')
        
        let end = moment(date).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss')

        Termine.update({
            _id
        },{
            $set: {
                ...termin,
                updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
                status: 'in-behandlung',
                patientRead: false
            }
        });
        return Behandlungen.insert({
            resourceId,
            resourceTitle,
            start: moment(date).format('YYYY-MM-DDTHH:mm:ss'),
            end,
            title: termin.title,
            termin_id: termin._id,
            user_id: this.userId,
            status: 'in-behandlung',
            createdAt: new Date(),
            updatedAt: new Date()
        })
    },

    'behandlung.update'( id, behandlung) {
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        let termin = Termine.findOne(behandlung.termin_id)

        Termine.update({_id: termin._id},{
            $set: {
                ...termin,
                patientRead: false,
                updatedAt: new Date()
            }
        });

        return Behandlungen.update({_id: id}, {
            $set: {
                ...behandlung,
                updatedAt: new Date()
            }
        })
    },

    'behandlung.abschluss_update'(_id, behandlung){
        if(!this.userId){
            throw new Meteor.Error('Nicht authorisiert!');
        }
        return Behandlungen.update({_id: _id}, {
            $set: {
                ...behandlung,
                updatedAt: new Date()
            }
        })
    }

});