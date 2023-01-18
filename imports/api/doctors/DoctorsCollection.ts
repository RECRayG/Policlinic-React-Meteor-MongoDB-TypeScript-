import { Mongo } from 'meteor/mongo';

export interface Doctor {
    _id: string;
    lastname: string;
    firstname: string;
    middlename: string;
    specialization: string;
    plot: string;
    cabinet: string;
}

export const DoctorsCollection = new Mongo.Collection<Doctor>('doctors');

DoctorsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});