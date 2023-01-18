import { Meteor } from 'meteor/meteor';

import { AnalysesCollection } from './AnalysesCollection';

Meteor.publish('analyses', function publishAnalyses() {
    return AnalysesCollection.find({});
});