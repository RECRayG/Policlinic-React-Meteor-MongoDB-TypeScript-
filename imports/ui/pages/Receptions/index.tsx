import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { ReceptionFields } from '/imports/ui/components/ReceptionsModal/ReceptionsForm';

import { ReceptionModal } from '../../components/ReceptionsModal';

import { routes } from './routes';

import { Reception } from '/imports/api/receptions';
import {RolesEnum} from "/imports/api/user";
import {UserFields} from "/imports/ui/components/UsersModal/UsersForm";

export const ReceptionsList = () => {
    const {data: receptions, isLoading, request} = useMeteorCall<Reception[]>('receptions.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentReception, setCurrentReception] = useState<Reception>();
    const navigate = useNavigate();

    const mappedList = receptions?.map(({
                                            doctor_id,
                                            doctor_description,
                                            patient_description,
                                            date_of_reception,
                                            time_of_reception,
                                            date_of_extract,
                                            _id
                                        }) => ({
        info: `${doctor_id} ${date_of_reception} ${time_of_reception} ${doctor_description} ${patient_description} ${date_of_extract}`,
        id: _id,
    })).sort((rec1, rec2) => {
        if(rec1.info.split(" ")[16] == 'undefined') return -1;
        if(rec2.info.split(" ")[16] == 'undefined') return 1;

        let formatDate1 = rec1.info.split(" ")[16].split("-")[2] + "-" + rec1.info.split(" ")[16].split("-")[1] + "-" + rec1.info.split(" ")[16].split("-")[0];
        let extract1 = new Date(formatDate1);

        let formatDate2 = rec2.info.split(" ")[16].split("-")[2] + "-" + rec2.info.split(" ")[16].split("-")[1] + "-" + rec2.info.split(" ")[16].split("-")[0];
        let extract2 = new Date(formatDate2);



        return extract1 < extract2 ? -1 : 1
    }); // Сортировка по дате закрытия приёма

    if (isLoading) {
        return <Loader/>;
    }

    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: ReceptionFields) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const transformPayload = {
            ...values,
            doctor_id: values.doctor_id.value,
            doctor_description: values.doctor_id.label,
            patient_id: values.patient_id.value,
            patient_description: values.patient_id.label,
            complaints: '',
            diagnosis: ''
        };
        await Meteor.callAsync('receptions.insert', {reception: {...transformPayload}});
        toggleCreateVisible();
        await request();
    };

    const onSubmitComplaints = async (reception: ReceptionFields, currComplaints: string) => {
        await Meteor.callAsync('receptions.updateComplaints', {
            request: {...reception, currComplaints},
        });
        toggleEditVisible();
        await request();
    };

    const onSubmitEdit = async (values: ReceptionFields) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const transformPayload = {
            ...values,
            doctor_description: values.doctor_id.label,
            patient_description: values.patient_id.label,
            doctor_id: values.doctor_id.value,
            patient_id: values.patient_id.value,
        };
        await Meteor.callAsync('receptions.update', {
            request: {...transformPayload, prevDate_Of_Reception: currentReception?.date_of_reception},
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const reception = await Meteor.callAsync('receptions.getById', {id});
        console.log('reception', reception);
        setCurrentReception(reception);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('receptions.remove', {receptionId: id});
        Meteor.call('analyses.removeByReceptionId', { id });
        Meteor.call('medications.removeByReceptionId', { id });
        await request();
    };

    const onItemClick = (id: string) => {
        navigate(generatePath(routes.view, {id}));
    };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Приёмная'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
                onItemClick={onItemClick}
            />
            <ReceptionModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <ReceptionModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                reception={currentReception}
                submitText={'Сохранить'}
            />
        </>
    );
};
