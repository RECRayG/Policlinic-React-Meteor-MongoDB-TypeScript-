import { Meteor } from 'meteor/meteor';

import { Medication, MedicationsCollection } from './MedicationsCollection';

Meteor.methods({
    'medications.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = MedicationsCollection.find();

        return query.fetch();
    },
    'medications.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return MedicationsCollection.findOne({ _id: id });
    },
    'medications.getByReceptionId'({ id }: { id: string }) {
        const query = MedicationsCollection.find({ reception_id: id });
        return query.fetch();
    },

    'medications.insert'({ medication }: { medication: Medication }) {
        MedicationsCollection.insert(medication);
    },

    'medications.remove'({ medicationId }: { medicationId: string }) {
        MedicationsCollection.remove(medicationId);
    },

    'medications.removeByReceptionId'({ id }: { id: string }) {
        MedicationsCollection.remove({ reception_id: id });
    },

    'medications.update'({ request }: { request: Medication & { prevReception_Id: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevReception_Id, ...medication } = request;

        console.log('request', request);
        MedicationsCollection.update(
            { _id: medication._id, reception_id: prevReception_Id },
            {
                $set: {
                    ...medication,
                },
            },
            {
                multi: false,
            }
        );
    },
});
