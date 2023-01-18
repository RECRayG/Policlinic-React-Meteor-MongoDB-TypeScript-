import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { TimetableFields } from '/imports/ui/components/TimetableModal/TimetableForm';

import { TimetableModal } from '../../components/TimetableModal';

import { routes } from './routes';

import { Timetable } from '/imports/api/timetable';
import {Doctor} from "/imports/api/doctors";

export const TimetableList = () => {
    const { data: timetable, isLoading, request } = useMeteorCall<Timetable[]>('timetable.get');
    const { data: doctors } = useMeteorCall<Doctor[]>('doctors.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentTimetable, setCurrentTimetable] = useState<Timetable>();
    // const navigate = useNavigate();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = timetable?.map(({ monday, tuesday, wednesday, thursday, friday, saturday, doctor_id, doctor_description, _id }) => ({
        // info: `${useMeteorCall<Doctor>('doctors.getById', { id: doctor_id }).data?.lastname} ${useMeteorCall<Doctor>('doctors.getById', { id: doctor_id }).data?.firstname} ${useMeteorCall<Doctor>('doctors.getById', { id: doctor_id }).data?.middlename} - ${useMeteorCall<Doctor>('doctors.getById', { id: doctor_id }).data?.specialization} `,
        info: `${doctor_description} ${monday} ${tuesday} ${wednesday} ${thursday} ${friday} ${saturday}`,
        id: _id,
    }));
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: TimetableFields) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const transformPayload = { ...values, doctor_id: values.doctor_id.value, doctor_description: values.doctor_id.label };
        await Meteor.callAsync('timetable.insert', { timetable: {...transformPayload} });
        toggleCreateVisible();
        await request();
    };

    const onSubmitEdit = async (values: TimetableFields) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const transformPayload = { ...values, doctor_id: values.doctor_id.value, doctor_description: values.doctor_id.label };
        await Meteor.callAsync('timetable.update', {
            request: { ...transformPayload, prevDoctor_Id: currentTimetable?.doctor_id },
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const timetable = await Meteor.callAsync('timetable.getById', { id });
        console.log('timetable', timetable);
        setCurrentTimetable(timetable);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('timetable.remove', { timetableId: id });
        await request();
    };

    // const onItemClick = (id: string) => {
    //     navigate(generatePath(routes.view, { id }));
    // };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Расписание врачей'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
                // onItemClick={onItemClick}
            />
            <TimetableModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <TimetableModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                timetable={currentTimetable}
                submitText={'Сохранить'}
            />
        </>
    );
};
