import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { DoctorFields } from '/imports/ui/components/DoctorsModal/DoctorsForm';

import { DoctorModal } from '../../components/DoctorsModal';

import { routes } from './routes';

import { Doctor } from '/imports/api/doctors';

export const DoctorsList = () => {
    const { data: doctors, isLoading, request } = useMeteorCall<Doctor[]>('doctors.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor>();
    const navigate = useNavigate();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = doctors?.map(({ lastname, firstname, middlename, specialization, plot, cabinet, _id }) => ({
        info: `${lastname} ${firstname} ${middlename} - ${specialization}`,
        id: _id,
    }));
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: DoctorFields) => {
        values.lastname = values.lastname.trim();
        if(values.lastname == "")
            values.lastname = "-";

        values.firstname = values.firstname.trim();
        if(values.firstname == "")
            values.firstname = "-";

        values.middlename = values.middlename.trim();
        if(values.middlename == "")
            values.middlename = "-";

        values.plot = values.plot.trim();
        if(values.plot == "")
            values.plot = "-";

        values.cabinet = values.cabinet.trim();
        if(values.cabinet == "")
            values.cabinet = "-";

        values.specialization = values.specialization.trim();
        if(values.specialization == "")
            values.specialization = "-";

        values.lastname = values.lastname.replace(" ", "-");
        values.firstname = values.firstname.replace(" ", "-");
        values.middlename = values.middlename.replace(" ", "-");
        values.plot = values.plot.replace(" ", "-");
        values.cabinet = values.cabinet.replace(" ", "-");
        values.specialization = values.specialization.replace(" ", "-");

        values.lastname = values.lastname.split(" ").reduce((acc, value) => acc + value);
        values.firstname = values.firstname.split(" ").reduce((acc, value) => acc + value);
        values.middlename = values.middlename.split(" ").reduce((acc, value) => acc + value);
        values.plot = values.plot.split(" ").reduce((acc, value) => acc + value);
        values.cabinet = values.cabinet.split(" ").reduce((acc, value) => acc + value);
        values.specialization = values.specialization.split(" ").reduce((acc, value) => acc + value);

        await Meteor.callAsync('doctors.insert', { doctor: values });
        toggleCreateVisible();
        await request();
    };

    const onSubmitEdit = async (values: DoctorFields) => {
        values.lastname = values.lastname.trim();
        if(values.lastname == "")
            values.lastname = "-";

        values.firstname = values.firstname.trim();
        if(values.firstname == "")
            values.firstname = "-";

        values.middlename = values.middlename.trim();
        if(values.middlename == "")
            values.middlename = "-";

        values.plot = values.plot.trim();
        if(values.plot == "")
            values.plot = "-";

        values.cabinet = values.cabinet.trim();
        if(values.cabinet == "")
            values.cabinet = "-";

        values.specialization = values.specialization.trim();
        if(values.specialization == "")
            values.specialization = "-";

        values.lastname = values.lastname.replace(" ", "-");
        values.firstname = values.firstname.replace(" ", "-");
        values.middlename = values.middlename.replace(" ", "-");
        values.plot = values.plot.replace(" ", "-");
        values.cabinet = values.cabinet.replace(" ", "-");
        values.specialization = values.specialization.replace(" ", "-");

        values.lastname = values.lastname.split(" ").reduce((acc, value) => acc + value);
        values.firstname = values.firstname.split(" ").reduce((acc, value) => acc + value);
        values.middlename = values.middlename.split(" ").reduce((acc, value) => acc + value);
        values.plot = values.plot.split(" ").reduce((acc, value) => acc + value);
        values.cabinet = values.cabinet.split(" ").reduce((acc, value) => acc + value);
        values.specialization = values.specialization.split(" ").reduce((acc, value) => acc + value);

        await Meteor.callAsync('doctors.update', {
            request: { ...values, prevLastname: currentDoctor?.lastname },
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const doctor = await Meteor.callAsync('doctors.getById', { id });
        console.log('doctor', doctor);
        setCurrentDoctor(doctor);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('doctors.remove', { doctorId: id });
        Meteor.call('timetable.removeByDoctorId', { id });
        await request();
    };

    const onItemClick = (id: string) => {
        navigate(generatePath(routes.view, { id }));
    };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Врачи'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
                onItemClick={onItemClick}
            />
            <DoctorModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <DoctorModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                doctor={currentDoctor}
                submitText={'Сохранить'}
            />
        </>
    );
};
