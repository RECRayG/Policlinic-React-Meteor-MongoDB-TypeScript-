import { Meteor } from 'meteor/meteor';

import { Analysis, AnalysesCollection } from './AnalysesCollection';

Meteor.methods({
    'analyses.get'() {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        const query = AnalysesCollection.find();

        return query.fetch();
    },
    'analyses.getById'({ id }: { id: string }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }
        return AnalysesCollection.findOne({ _id: id });
    },
    'analyses.getByReceptionId'({ id }: { id: string }) {
        const query = AnalysesCollection.find({ reception_id: id });
        return query.fetch();
    },

    'analyses.insert'({ analysis }: { analysis: Analysis }) {
        AnalysesCollection.insert(analysis);
    },

    'analyses.remove'({ analysisId }: { analysisId: string }) {
        AnalysesCollection.remove(analysisId);
    },

    'analyses.removeByReceptionId'({ id }: { id: string }) {
        AnalysesCollection.remove({ reception_id: id });
    },

    'analyses.update'({ request }: { request: Analysis & { prevReception_Id: string } }) {
        if (!this.userId) {
            throw new Meteor.Error('Not authorized.');
        }

        const { prevReception_Id, ...analysis } = request;

        console.log('request', request);
        AnalysesCollection.update(
            { _id: analysis._id, reception_id: prevReception_Id },
            {
                $set: {
                    ...analysis,
                },
            },
            {
                multi: false,
            }
        );
    },
});
