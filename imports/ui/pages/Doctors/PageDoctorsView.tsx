import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import '../index.css';

import Box from '@mui/material/Box';
import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { Doctor } from '/imports/api/doctors';
import { Timetable } from '/imports/api/timetable';
import {InputLabel} from "@mui/material";

export const DoctorView = () => {
    const params = useParams<{ id: string }>();
    const { data: doctor, isLoading, request } = useMeteorCall<Doctor>('doctors.getById', { id: params.id });

    const { data: timetable } = useMeteorCall<Timetable[]>('timetable.getByDoctorId', { id: params.id });

    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    if (isLoading /*|| isOffers*/) {
        return <Loader />;
    }

    const mappedList = timetable?.map(({ monday, tuesday, wednesday, thursday, friday, saturday, _id }) => ({
        info: `${monday} ${tuesday} ${wednesday} ${thursday} ${friday} ${saturday}`,
        id: _id,
    }));
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };

    return (
        <div className="pageView">
            <h1>Врач {`${doctor?.lastname} ${doctor?.firstname} ${doctor?.middlename} ${doctor?.specialization} `}</h1>
            <Box borderRadius="8px" border={'1px solid blue'} padding={'10px'} display="flex" flexDirection="column">
                <h2>Информация о враче</h2>
                <div>{`ФИО: ${doctor?.lastname} ${doctor?.firstname} ${doctor?.middlename} `}</div>
                <div>{`Специальность: ${doctor?.specialization} `}</div>
                <div>{`Участок: ${doctor?.plot} `}</div>
                <div>{`Кабинет: ${doctor?.cabinet} `}</div>
            </Box>
            {/*<Box borderRadius="8px" border={'1px solid white'} padding={'10px'} display="flex" flexDirection="column">*/}
            {/*    <InputLabel>Расписание</InputLabel>*/}
            {/*    <div>{`ПН: ${timetable?.monday} `}</div>*/}
            {/*    <div>{`ВТ: ${timetable?.tuesday} `}</div>*/}
            {/*    <div>{`СР: ${timetable?.wednesday} `}</div>*/}
            {/*    <div>{`ЧТ: ${timetable?.thursday} `}</div>*/}
            {/*    <div>{`ПТ: ${timetable?.friday} `}</div>*/}
            {/*    <div>{`СБ: ${timetable?.saturday} `}</div>*/}
            {/*</Box>*/}
            <ItemsList data={mappedList ?? []} title={'Расписание'} />
        </div>
    );
};
