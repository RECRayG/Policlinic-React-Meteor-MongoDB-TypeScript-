import { Meteor } from 'meteor/meteor';

import { Patient, PatientsCollection } from './PatientsCollection';

Meteor.methods({
    'patients.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = PatientsCollection.find();

        return query.fetch();
    },
    'patients.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return PatientsCollection.findOne({ _id: id });
    },

    'patients.insert'({ patient }: { patient: Patient }) {
        PatientsCollection.insert(patient);
    },

    'patients.remove'({ patientId }: { patientId: string }) {
        PatientsCollection.remove(patientId);
    },

    'patients.update'({ request }: { request: Patient & { prevLastname: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevLastname, ...patient } = request;
        console.log(prevLastname);
        console.log('request', request);
        PatientsCollection.update(
            { _id: patient._id, lastname: prevLastname },
            {
                $set: {
                    ...patient,
                },
            },
            {
                multi: false,
            }
        );
    },
});
