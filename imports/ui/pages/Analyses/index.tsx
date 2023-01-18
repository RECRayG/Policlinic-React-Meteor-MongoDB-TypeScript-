import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';

import { Doctor } from '/imports/api/doctors';
import {Reception} from "/imports/api/receptions";
import {Analysis} from "/imports/api/analyses";
import { AnalysisFields } from '/imports/ui/components/AnalysesModal/AnalysesForm';
import {AnalysisModal} from "/imports/ui/components/AnalysesModal";
import {ReceptionFields} from "/imports/ui/components/ReceptionsModal/ReceptionProcedures";

interface UserFormProps {
    reception?: Reception;
}

export const AnalysesList: React.FC<UserFormProps> = ({
                                                          reception
                                                      }) => {
    const { data: analyses, isLoading, request } = useMeteorCall<Analysis[]>('analyses.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentAnalysis, setCurrentAnalysis] = useState<Analysis>();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = analyses?.map(({ analysis, analysis_result, reception_id, _id }) => ({
        info: `${reception_id};${analysis};${analysis_result};${reception?.date_of_extract}`,
        id: _id,
    })).filter((analyses) => analyses.info.split(";")[0] == reception?._id); // Только анализы для текущего приёма
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: AnalysisFields) => {
        values.analysis = values.analysis.trim();
        if(values.analysis == "")
            values.analysis = "-";

        values.analysis = values.analysis.replace(";", " ");
        values.analysis = values.analysis.split(";").reduce((acc, value) => acc + value);

        if(reception?._id) {
            values.reception_id = reception?._id;
        }

        await Meteor.callAsync('analyses.insert', { analysis: values });
        toggleCreateVisible();
        await request();
    };

    const onSubmitEdit = async (values: AnalysisFields) => {
        values.analysis = values.analysis.trim();
        if(values.analysis == "")
            values.analysis = "-";

        values.analysis = values.analysis.replace(";", " ");
        values.analysis = values.analysis.split(";").reduce((acc, value) => acc + value);

        values.analysis_result = values.analysis_result.trim();
        if(values.analysis_result == "")
            values.analysis_result = "-";

        values.analysis_result = values.analysis_result.replace(";", " ");
        values.analysis_result = values.analysis_result.split(";").reduce((acc, value) => acc + value);

        if(reception?._id) {
            values.reception_id = reception?._id;
        }

        await Meteor.callAsync('analyses.update', {
            request: { ...values, prevReception_Id: currentAnalysis?.reception_id },
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const analysis = await Meteor.callAsync('analyses.getById', { id });
        console.log('analysis', analysis);
        setCurrentAnalysis(analysis);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('analyses.remove', { analysisId: id });
        await request();
    };

    return (
        <>
            <ItemsList
            data={mappedList ?? []}
            title={'Анализы и их результаты'}
            onDeleteItem={onDelete}
            onEditItem={onEdit}
            onCreate={toggleCreateVisible}
            date_of_extract={reception?.date_of_extract}
            />
            <AnalysisModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <AnalysisModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                analysis={currentAnalysis}
                submitText={'Сохранить'}
            />
        </>
    );
};
