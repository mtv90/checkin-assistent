import mkFhir from 'fhir.js';
import { Meteor } from 'meteor/meteor';
import { WebApp } from 'meteor/webapp';

// Funktion zur Abfrage von FHIR-Daten 
Meteor.methods({
    'getAppointments'(){
        const baseUrl = 'http://test.fhir.org/r4/';
        const client = mkFhir({baseUrl});
        const type = 'Appointment';
        
        return client.search({type})
        .then( (res) => {
            return res.data;
        })
        .catch( err => {
            console.log(err.data.text.div);
            throw new Meteor.Error(err.data.text.div, 'Es konnten keine Termine vom FHIR-Server geladen werden');
        }); 
    }
});       
