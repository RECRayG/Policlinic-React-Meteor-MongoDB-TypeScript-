import React, { useState } from 'react';

import { generatePath, useNavigate } from 'react-router-dom';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { PatientFields } from '/imports/ui/components/PatientsModal/PatientsForm';

import { PatientModal } from '../../components/PatientsModal';

import { routes } from './routes';

import { Patient } from '/imports/api/patients';

export const PatientsList = () => {
    const { data: patients, isLoading, request } = useMeteorCall<Patient[]>('patients.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentPatient, setCurrentPatient] = useState<Patient>();
    const navigate = useNavigate();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = patients?.map(({ lastname, firstname, middlename, city, street, building, apartment, _id }) => ({
        info: `${lastname} ${firstname} ${middlename} - г.${city}, ул.${street}, д.${building}, кв.${apartment}`,
        id: _id,
    }));
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };
    const onSubmitCreate = async (values: PatientFields) => {
        values.lastname = values.lastname.trim();
        if(values.lastname == "")
            values.lastname = "-";

        values.firstname = values.firstname.trim();
        if(values.firstname == "")
            values.firstname = "-";

        values.middlename = values.middlename.trim();
        if(values.middlename == "")
            values.middlename = "-";

        values.city = values.city.trim();
        if(values.city == "")
            values.city = "-";

        values.street = values.street.trim();
        if(values.street == "")
            values.street = "-";

        values.building = values.building.trim();
        if(values.building == "")
            values.building = "-";

        values.apartment = values.apartment.trim();
        if(values.apartment == "")
            values.apartment = "-";

        values.lastname = values.lastname.replace(" ", "-");
        values.firstname = values.firstname.replace(" ", "-");
        values.middlename = values.middlename.replace(" ", "-");
        values.city = values.city.replace(" ", "-");
        values.street = values.street.replace(" ", "-");
        values.building = values.building.replace(" ", "-");
        values.apartment = values.apartment.replace(" ", "-");

        values.lastname = values.lastname.split(" ").reduce((acc, value) => acc + value);
        values.firstname = values.firstname.split(" ").reduce((acc, value) => acc + value);
        values.middlename = values.middlename.split(" ").reduce((acc, value) => acc + value);
        values.city = values.city.split(" ").reduce((acc, value) => acc + value);
        values.street = values.street.split(" ").reduce((acc, value) => acc + value);
        values.building = values.building.split(" ").reduce((acc, value) => acc + value);
        values.apartment = values.apartment.split(" ").reduce((acc, value) => acc + value);

        await Meteor.callAsync('patients.insert', { patient: values });
        toggleCreateVisible();
        await request();
    };

    const onSubmitEdit = async (values: PatientFields) => {
        values.lastname = values.lastname.trim();
        if(values.lastname == "")
            values.lastname = "-";

        values.firstname = values.firstname.trim();
        if(values.firstname == "")
            values.firstname = "-";

        values.middlename = values.middlename.trim();
        if(values.middlename == "")
            values.middlename = "-";

        values.city = values.city.trim();
        if(values.city == "")
            values.city = "-";

        values.street = values.street.trim();
        if(values.street == "")
            values.street = "-";

        values.building = values.building.trim();
        if(values.building == "")
            values.building = "-";

        values.apartment = values.apartment.trim();
        if(values.apartment == "")
            values.apartment = "-";

        values.lastname = values.lastname.replace(" ", "-");
        values.firstname = values.firstname.replace(" ", "-");
        values.middlename = values.middlename.replace(" ", "-");
        values.city = values.city.replace(" ", "-");
        values.street = values.street.replace(" ", "-");
        values.building = values.building.replace(" ", "-");
        values.apartment = values.apartment.replace(" ", "-");

        values.lastname = values.lastname.split(" ").reduce((acc, value) => acc + value);
        values.firstname = values.firstname.split(" ").reduce((acc, value) => acc + value);
        values.middlename = values.middlename.split(" ").reduce((acc, value) => acc + value);
        values.city = values.city.split(" ").reduce((acc, value) => acc + value);
        values.street = values.street.split(" ").reduce((acc, value) => acc + value);
        values.building = values.building.split(" ").reduce((acc, value) => acc + value);
        values.apartment = values.apartment.split(" ").reduce((acc, value) => acc + value);

        await Meteor.callAsync('patients.update', {
            request: { ...values, prevLastname: currentPatient?.lastname },
        });
        toggleEditVisible();
        await request();
    };

    const onEdit = async (id: string) => {
        const patient = await Meteor.callAsync('patients.getById', { id });
        console.log('patient', patient);
        setCurrentPatient(patient);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('patients.remove', { patientId: id });
        await request();
    };

    const onItemClick = (id: string) => {
        navigate(generatePath(routes.view, { id }));
    };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Пациенты'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
                onItemClick={onItemClick}
            />
            <PatientModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate}/>
            <PatientModal
                visible={editVisible}
                onClose={toggleEditVisible}
                onSubmit={onSubmitEdit}
                patient={currentPatient}
                submitText={'Сохранить'}
            />
        </>
    );
};
