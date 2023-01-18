import { Mongo } from 'meteor/mongo';

export interface Medication {
    _id: string;
    medication: string;
    reception_id: string;
}

export const MedicationsCollection = new Mongo.Collection<Medication>('medications');

MedicationsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});