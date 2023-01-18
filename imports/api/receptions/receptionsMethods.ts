import { Meteor } from 'meteor/meteor';

import { Reception, ReceptionsCollection } from './ReceptionsCollection';

Meteor.methods({
    'receptions.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = ReceptionsCollection.find();

        return query.fetch();
    },
    'receptions.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return ReceptionsCollection.findOne({ _id: id });
    },
    'receptions.getByDoctorPatientDate'({ id_doc, id_pat, date }: { id_doc: string, id_pat: string, date: string }) {
        const query = ReceptionsCollection.find({ doctor_id: id_doc, patient_id: id_pat, date_of_reception: date });
        return query.fetch();
    },

    'receptions.insert'({ reception }: { reception: Reception }) {
        ReceptionsCollection.insert(reception);
    },

    'receptions.remove'({ receptionId }: { receptionId: string }) {
        ReceptionsCollection.remove(receptionId);
    },

    'receptions.removeByDoctorPatientDate'({ id_doc, id_pat, date }: { id_doc: string, id_pat: string, date: string }) {
        ReceptionsCollection.remove({ doctor_id: id_doc, patient_id: id_pat, date_of_reception: date });
    },

    'receptions.update'({ request }: { request: Reception & { prevDoctor_Id: string, prevPatient_Id: string, prevDate_Of_Reception: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevDoctor_Id, prevPatient_Id, prevDate_Of_Reception, ...reception } = request;

        console.log('request', request);
        ReceptionsCollection.update(
            { _id: reception._id, doctor_id: prevDoctor_Id, patient_id: prevPatient_Id, date_of_reception: prevDate_Of_Reception },
            {
                $set: {
                    ...reception,
                },
            },
            {
                multi: false,
            }
        );
    },

    'receptions.updateDateExtract'(request: Reception) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const {...reception } = request;

        const currDate = new Date();
        let Day = currDate.getDate() + "";
        let Month = (currDate.getMonth() + 1) + "";

        if(Day.length != 2)
            Day = "0" + Day;

        if(Month.length != 2)
            Month = "0" + Month;

        let currDateFormat = Day + "-" + Month + "-" + currDate.getFullYear();

        if(currDateFormat.length < 10 || currDateFormat.length > 10)
            throw new Meteor.Error('Ошибка формата даты');

        ReceptionsCollection.update(
            { _id: reception._id },
            {
                $set: {
                    date_of_extract: currDateFormat,
                },
            },
            {
                multi: false,
            }
        );
    },
});
