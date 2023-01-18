import { Meteor } from 'meteor/meteor';

import { TimetableCollection } from './TimetableCollection';

Meteor.publish('timetable', function publishTimetable() {
    return TimetableCollection.find({});
});