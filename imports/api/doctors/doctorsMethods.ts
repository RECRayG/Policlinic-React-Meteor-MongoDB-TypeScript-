import { Meteor } from 'meteor/meteor';

import { Doctor, DoctorsCollection } from './DoctorsCollection';
import { useTracker } from 'meteor/react-meteor-data';

Meteor.methods({
    'doctors.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = DoctorsCollection.find();

        return query.fetch();
    },
    'doctors.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return DoctorsCollection.findOne({ _id: id });
    },
    'doctors.getByFullNameAndSpec'({ lastnameCall, firstnameCall, middlenameCall, specializationCall }: { lastnameCall: string, firstnameCall: string, middlenameCall: string, specializationCall: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return DoctorsCollection.findOne({ lastname: lastnameCall, firstname: firstnameCall, middlename: middlenameCall, specialization: specializationCall });
    },

    'doctors.insert'({ doctor }: { doctor: Doctor }) {
        DoctorsCollection.insert(doctor);
    },

    'doctors.remove'({ doctorId }: { doctorId: string }) {
        DoctorsCollection.remove(doctorId);
    },

    'doctors.update'({ request }: { request: Doctor & { prevLastname: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevLastname, ...doctor } = request;
        console.log(prevLastname);
        console.log('request', request);
        DoctorsCollection.update(
            { _id: doctor._id, lastname: prevLastname },
            {
                $set: {
                    ...doctor,
                },
            },
            {
                multi: false,
            }
        );
    },
});
