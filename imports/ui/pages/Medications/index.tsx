import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';

import { Doctor } from '/imports/api/doctors';
import {Reception} from "/imports/api/receptions";
import {Medication} from "/imports/api/medications";
import { MedicationFields } from '/imports/ui/components/MedicationsModal/MedicationsForm';
import {MedicationModal} from "/imports/ui/components/MedicationsModal";
import {ReceptionFields} from "/imports/ui/components/ReceptionsModal/ReceptionProcedures";

interface UserFormProps {
    reception?: Reception;
}

export const MedicationsList: React.FC<UserFormProps> = ({
                                                          reception
                                                      }) => {
    const { data: medications, isLoading, request } = useMeteorCall<Medication[]>('medications.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentMedication, setCurrentMedication] = useState<Medication>();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = medications?.map(({ medication, reception_id, _id }) => ({
        info: `${reception_id};${medication};${reception?.date_of_extract}`,
        id: _id,
    })).filter((medications) => medications.info.split(";")[0] == reception?._id); // Только анализы для текущего приёма
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: MedicationFields) => {
        values.medication = values.medication.trim();
        if(values.medication == "")
            values.medication = "-";

        values.medication = values.medication.replace(";", " ");
        values.medication = values.medication.split(";").reduce((acc, value) => acc + value);

        if(reception?._id) {
            values.reception_id = reception?._id;
        }

        await Meteor.callAsync('medications.insert', { medication: values });
        toggleCreateVisible();
        await request();
    };

    const onSubmitEdit = async (values: MedicationFields) => {
        values.medication = values.medication.trim();
        if(values.medication == "")
            values.medication = "-";

        values.medication = values.medication.replace(";", " ");
        values.medication = values.medication.split(";").reduce((acc, value) => acc + value);

        if(reception?._id) {
            values.reception_id = reception?._id;
        }

        if(reception?._id) {
            values.reception_id = reception?._id;
        }

        await Meteor.callAsync('medications.update', {
            request: { ...values, prevReception_Id: currentMedication?.reception_id },
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const medication = await Meteor.callAsync('medications.getById', { id });
        console.log('medication', medication);
        setCurrentMedication(medication);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('medications.remove', { medicationId: id });
        await request();
    };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Медикаменты'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
                date_of_extract={reception?.date_of_extract}
            />
            <MedicationModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <MedicationModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                medication={currentMedication}
                submitText={'Сохранить'}
            />
        </>
    );
};
