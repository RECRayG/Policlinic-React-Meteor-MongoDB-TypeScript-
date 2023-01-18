import { Meteor } from 'meteor/meteor';

import { PatientsCollection } from './PatientsCollection';

Meteor.publish('patients', function publishPatients() {
    return PatientsCollection.find({});
});