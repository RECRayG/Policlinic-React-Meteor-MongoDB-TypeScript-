import { Mongo } from 'meteor/mongo';

export interface Analysis {
    _id: string;
    analysis: string;
    analysis_result: string;
    reception_id: string;
}

export const AnalysesCollection = new Mongo.Collection<Analysis>('analyses');

AnalysesCollection.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; }
});