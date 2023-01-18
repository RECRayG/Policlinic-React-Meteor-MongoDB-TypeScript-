import { Mongo } from 'meteor/mongo';

export interface Patient {
    _id: string;
    lastname: string;
    firstname: string;
    middlename: string;
    city: string;
    street: string;
    building: string;
    apartment: string;
}

export const PatientsCollection = new Mongo.Collection<Patient>('patients');

PatientsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});