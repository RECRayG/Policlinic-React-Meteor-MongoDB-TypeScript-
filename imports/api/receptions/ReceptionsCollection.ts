import { Mongo } from 'meteor/mongo';

export interface Reception {
    _id: string;
    date_of_reception: string;
    complaints: string;
    diagnosis: string;
    date_of_extract: string;
    time_of_reception: string;
    procedures: string;

    doctor_id: string;
    doctor_description: string;

    patient_id: string;
    patient_description: string;

    analysis_id: string; ///////////////////////////////
}

export const ReceptionsCollection = new Mongo.Collection<Reception>('receptions');

ReceptionsCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});