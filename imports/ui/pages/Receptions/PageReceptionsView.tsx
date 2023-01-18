import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import '../index.css';

import Box from '@mui/material/Box';
import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { Reception } from '/imports/api/receptions';
import { Analysis } from '/imports/api/analyses';
import { Doctor } from '/imports/api/doctors';
import { Patient } from '/imports/api/patients';
import {Button, TextareaAutosize} from "@mui/material";
import "./TextareaAutosizeStyle.css";

import { ReceptionsList } from './index';

import {handleInputChange} from "react-select/dist/declarations/src/utils";
// import {ReceptionFields} from "/imports/ui/components/ReceptionsModal/ReceptionsForm";
import {useForm} from "react-hook-form";
import {ReceptionModal} from "/imports/ui/components/ReceptionsModal";
import {ReceptionComplaints, ReceptionFields} from "/imports/ui/components/ReceptionsModal/ReceptionComplaints";
import {ReceptionDiagnosis} from "/imports/ui/components/ReceptionsModal/ReceptionDiagnosis";
import {ReceptionProcedures} from "/imports/ui/components/ReceptionsModal/ReceptionProcedures";
import {AnalysesList} from "/imports/ui/pages/Analyses";
import {MedicationsList} from "/imports/ui/pages/Medications";
// import { ReceptionFields } from '/imports/ui/components/ReceptionsModal/ReceptionsForm';

export const ReceptionView = () => {
    const params = useParams<{ id: string }>();
    const { data: reception, isLoading, request } = useMeteorCall<Reception>('receptions.getById', { id: params.id });
    // const { data: analyses } = useMeteorCall<Analysis[]>('analyses.getByReceptionId', { id: params.id });
    const { data: doctors } = useMeteorCall<Doctor[]>('doctors.get');
    const { data: patients } = useMeteorCall<Patient[]>('patients.get');

    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);

    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };

    // const {
    //     register,
    //     watch
    // } = useForm<ReceptionFields>({
    //     defaultValues: reception
    // });

    // const currComplaints = watch('complaints');

    if (isLoading) {
        return <Loader />;
    }

    // const mappedListAn = analyses?.map(({ analysis, analysis_result, _id }) => ({
    //     info: `${analysis} - ${analysis_result}`,
    //     id: _id,
    // }));
    const mappedListDoc = doctors?.map(({ lastname, firstname, middlename, plot, cabinet, specialization, _id }) => ({
        info: `${reception?.doctor_description} ${lastname} ${firstname} ${middlename} ${specialization} ${plot} ${cabinet}`,
        id: _id,
    }));
    const mappedListPat = patients?.map(({ lastname, firstname, middlename, city, street, building, apartment, _id }) => ({
        info: `${reception?.patient_description} ${lastname} ${firstname} ${middlename} г.${city}, ул.${street}, д.${building}, кв.${apartment}`,
        id: _id,
    }));

    const onSubmitSave = async (values: ReceptionFields) => {
        await Meteor.callAsync('receptions.update', {
            request: {...values},
        });

        toggleEditVisible();
        await request();
    };

    const onCloseReceptions = async () => {
        await Meteor.callAsync('receptions.updateDateExtract', reception);
        toggleEditVisible();
        await request();
    };

    return (
        <div className="pageView">
            <h1>Приём от {`${reception?.date_of_reception} ${reception?.time_of_reception}`}
                {reception?.date_of_extract && <span>, Закрыто {reception?.date_of_extract}</span>}
            </h1>
            <ItemsList data={mappedListDoc ?? []} title={'Информация о враче'} />
            <ItemsList data={mappedListPat ?? []} title={'Информация о пациенте'} />
            <ReceptionComplaints
                onSubmit={onSubmitSave}
                reception={reception}
                submitText={'Сохранить жалобу'}
            />
            <ReceptionDiagnosis
                onSubmit={onSubmitSave}
                reception={reception}
                submitText={'Сохранить диагноз'}
            />
            <ReceptionProcedures
                onSubmit={onSubmitSave}
                reception={reception}
                submitText={'Сохранить процедуры'}
            />

            <AnalysesList reception={reception} />
            <MedicationsList reception={reception} />

            {!reception?.date_of_extract &&
                <Button style={{marginTop: '80px'}} variant={'contained'} color={'secondary'} onClick={() => onCloseReceptions()}>
                    Выписать пациента
                </Button>}

            {/*<h2>Жалобы</h2>*/}
            {/*<TextareaAutosize {...register('complaints')} className="TextareaAutosizeStyle" minRows={5} defaultValue={reception?.complaints}></TextareaAutosize>*/}
            {/*<Button type={'submit'} variant={'contained'} color={'secondary'} onSubmit={onSubmitComplaints}>*/}
            {/*    Сохранить жалобы*/}
            {/*</Button>*/}
        </div>
    );
};
