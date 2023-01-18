import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import '../index.css';

import Box from '@mui/material/Box';
import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { Patient } from '/imports/api/patients';

export const PatientView = () => {
    const params = useParams<{ id: string }>();
    const { data: patient, isLoading, request } = useMeteorCall<Patient>('patients.getById', { id: params.id });

    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    if (isLoading /*|| isOffers*/) {
        return <Loader />;
    }
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };

    return (
        <div className="pageView">
            <h1>Пациент {`${patient?.lastname} ${patient?.firstname} ${patient?.middlename} `}</h1>
            <Box borderRadius="8px" border={'1px solid blue'} padding={'10px'} display="flex" flexDirection="column">
                <h2>Информация о пациенте</h2>
                <div>{`ФИО: ${patient?.lastname} ${patient?.firstname} ${patient?.middlename} `}</div>
                <div>{`Город: ${patient?.city} `}</div>
                <div>{`Улица: ${patient?.street} `}</div>
                <div>{`Дом: ${patient?.building} `}</div>
                <div>{`Квартира: ${patient?.apartment} `}</div>
            </Box>
        </div>
    );
};
