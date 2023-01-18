import { Meteor } from 'meteor/meteor';

import { DoctorsCollection } from './DoctorsCollection';

Meteor.publish('doctors', function publishDoctors() {
    return DoctorsCollection.find({});
});