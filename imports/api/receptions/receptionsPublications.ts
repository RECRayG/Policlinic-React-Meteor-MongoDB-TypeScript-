import { Meteor } from 'meteor/meteor';

import { ReceptionsCollection } from './ReceptionsCollection';

Meteor.publish('receptions', function publishReceptions() {
    return ReceptionsCollection.find({});
});