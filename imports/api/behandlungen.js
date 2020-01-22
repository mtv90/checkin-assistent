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

        // moment(date) < moment(termin.start) && 
        if(moment(date) < moment()){
            // throw new Meteor.Error('Sie können keine Termine in die Vergangenheit schieben');
            const startdate = moment().format('YYYY-MM-DDTHH:mm:ss');
           
            Termine.update({
                _id,
                user_id: this.userId
            },{
                $set: {
                    ...termin,
                    updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
                    status: 'in-behandlung'
                }
            });
            return Behandlungen.insert({
                resourceId,
                start: startdate,
                end: moment(startdate).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss'),
                resourceTitle: resourceTitle,
                title: termin.title,
                termin_id: termin._id,
                user_id: this.userId,
                status: 'in-behandlung',
                createdAt: new Date(),
                updatedAt: new Date()
            })
        }
        Termine.update({
            _id,
            user_id: this.userId
        },{
            $set: {
                ...termin,
                updatedAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
                status: 'in-behandlung'
            }
        });
        return Behandlungen.insert({
            resourceId,
            start: moment(date).format('YYYY-MM-DDTHH:mm:ss'),
            end,
            title: termin.title,
            termin_id: termin._id,
            user_id: this.userId,
            status: 'in-behandlung',
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }
});