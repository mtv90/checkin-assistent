import { Meteor } from 'meteor/meteor';


import '../imports/api/users';
import '../imports/api/termine';
import '../imports/api/praxen';
import '../imports/api/behandlungen';
import '../imports/api/konten';
import '../imports/interfaces/fhir_appointments';
import '../imports/startup/simple-schema-configuration';

Meteor.startup(() => {

    Roles.createRole('admin', {unlessExists: true});
    Roles.createRole('patient', {unlessExists: true});

});
