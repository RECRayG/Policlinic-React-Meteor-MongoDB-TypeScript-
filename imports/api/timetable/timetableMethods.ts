import { Meteor } from 'meteor/meteor';

import { Timetable, TimetableCollection } from './TimetableCollection';

Meteor.methods({
    'timetable.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = TimetableCollection.find();

        return query.fetch();
    },
    'timetable.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return TimetableCollection.findOne({ _id: id });
    },
    'timetable.getByDoctorId'({ id }: { id: string }) {
        const query = TimetableCollection.find({ doctor_id: id });
        return query.fetch();
    },
    'timetable.getOneByDoctorId'({ id }: { id: string }) {
        return TimetableCollection.findOne({ doctor_id: id });
    },

    'timetable.insert'({ timetable }: { timetable: Timetable }) {
        TimetableCollection.insert(timetable);
    },

    'timetable.remove'({ timetableId }: { timetableId: string }) {
        TimetableCollection.remove(timetableId);
    },

    'timetable.removeByDoctorId'({ id }: { id: string }) {
        TimetableCollection.remove({doctor_id: id});
    },

    'timetable.update'({ request }: { request: Timetable & { prevDoctor_Id: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevDoctor_Id, ...timetable } = request;

        console.log('request', request);
        TimetableCollection.update(
            { _id: timetable._id, doctor_id: prevDoctor_Id },
            {
                $set: {
                    ...timetable,
                },
            },
            {
                multi: false,
            }
        );
    },
});
