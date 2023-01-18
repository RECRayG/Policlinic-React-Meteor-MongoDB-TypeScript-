import { Meteor } from 'meteor/meteor';

import { MedicationsCollection } from './MedicationsCollection';

Meteor.publish('medications', function publishMedications() {
    return MedicationsCollection.find({});
});