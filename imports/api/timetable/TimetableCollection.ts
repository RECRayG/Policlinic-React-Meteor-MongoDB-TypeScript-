import { Mongo } from 'meteor/mongo';

export interface Timetable {
    _id: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;

    doctor_id: string;
    doctor_description: string;
}

export const TimetableCollection = new Mongo.Collection<Timetable>('timetable');

TimetableCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});