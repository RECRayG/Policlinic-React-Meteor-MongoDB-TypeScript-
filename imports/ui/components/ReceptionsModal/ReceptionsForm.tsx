import React from 'react';

import ReactInputMask from 'react-input-mask';
import { Controller, useForm } from 'react-hook-form';

import {Box, Button, InputLabel} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Select } from '/imports/ui/shared/ui/Select';
import { Reception } from "/imports/api/receptions/ReceptionsCollection";
import { Doctor } from '/imports/api/doctors';
import { Patient } from '/imports/api/patients';
import { Timetable } from '/imports/api/timetable';
import { Analysis } from '/imports/api/analyses';
import {useMeteorCall} from "/imports/ui/shared/hooks/useMeteorCall";
import {useParams} from "react-router-dom";
import getFieldValue from "react-hook-form/dist/logic/getFieldValue";

export type ReceptionFields = Omit<Reception, '_id'>;
interface UserFormProps {
    title: string;
    onSubmit: (values: ReceptionFields) => void;
    onCancel: () => void;
    reception?: Reception;
    submitText?: string;
}

export const ReceptionForm: React.FC<UserFormProps> = ({
                                                           title,
                                                           reception,
                                                           onSubmit,
                                                           submitText = 'Назначить приём',
                                                           onCancel,
                                                       }) => {
    // const methodsTimetable = useForm<TimetableFields>({
    //     defaultValues: timetable,
    // });

    const {
        register,
        formState: {errors},
        handleSubmit,
        control,
        watch
    } = useForm<ReceptionFields>({
        defaultValues: reception,
        mode: "onSubmit"
    });

    console.log('reception inside', reception);

    const { data: doctors } = useMeteorCall<Doctor[]>('doctors.get');
    const { data: patient } = useMeteorCall<Patient[]>('patients.get');
    const { data: timetable } = useMeteorCall<Timetable[]>('timetable.get');

    const mappedListDoc = doctors?.map(({ lastname, firstname, middlename, specialization, _id }) => ({
        label: `${lastname} ${firstname} ${middlename} - ${specialization}`,
        value: _id,
    }));
    const mappedListPat = patient?.map(({ lastname, firstname, middlename, city, street, building, apartment, _id }) => ({
        label: `${lastname} ${firstname} ${middlename} - г.${city}, ул.${street}, д.${building}, кв.${apartment}`,
        value: _id,
    }));
    const mappedListTim = timetable?.map(({ monday, tuesday, wednesday, thursday, friday, saturday, doctor_id, doctor_description, _id }) => ({
        doctorId: doctor_id,
        id: _id,
        Monday: monday,
        Tuesday: tuesday,
        Wednesday: wednesday,
        Thursday: thursday,
        Friday: friday,
        Saturday: saturday,
    }));

    const doctorFrom = watch('doctor_id')
    const dateFrom = watch('date_of_reception')

    const isDayOfWeek = (date: string) => {
        // let lastnameCall = doctorFrom.label.split(" ")[0];
        // let firstnameCall = doctorFrom.label.split(" ")[1];
        // let middlenameCall = doctorFrom.label.split(" ")[2];
        // let specializationCall = doctorFrom.label.split(" ")[4];

        console.log("Timetables", mappedListTim);
        // @ts-ignore
        let localTimetable = mappedListTim.filter(timee => timee.doctorId == doctorFrom.value)[0]

        let formatDate = date.split("-")[2] + "-" + date.split("-")[1] + "-" + date.split("-")[0];
        let d = new Date(formatDate);
        let n = d.getDay();

        switch (n) {
            case 0:
                return false;
                break;
            case 1:
                // @ts-ignore
                if(localTimetable.Monday != '') // Если понедельник есть у врача
                    return true;
                else
                    return false;
                break;
            case 2:
                // @ts-ignore
                if(localTimetable.Tuesday != '')
                    return true;
                else
                    return false;
                break;
            case 3:
                // @ts-ignore
                if(localTimetable.Wednesday != '')
                    return true;
                else
                    return false;
                break;
            case 4:
                // @ts-ignore
                if(localTimetable.Thursday != '')
                    return true;
                else
                    return false;
                break;
            case 5:
                // @ts-ignore
                if(localTimetable.Friday != '')
                    return true;
                else
                    return false;
                break;
            case 6:
                // @ts-ignore
                if(localTimetable.Saturday != '')
                    return true;
                else
                    return false;
                break;
        }

        return false
    }

    const isWorkTime = (time: string) => {
        console.log("Timetables", mappedListTim);
        // @ts-ignore
        let localTimetable = mappedListTim.filter(timee => timee.doctorId == doctorFrom.value)[0]

        let formatDate = dateFrom.split("-")[2] + "-" + dateFrom.split("-")[1] + "-" + dateFrom.split("-")[0];
        let d = new Date(formatDate);
        let n = d.getDay();

        let begin = '';
        let end = '';
        switch (n) {
            case 1:
                // @ts-ignore
                begin = localTimetable.Monday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Monday.split("-")[1];
                break;
            case 2:
                // @ts-ignore
                begin = localTimetable.Tuesday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Tuesday.split("-")[1];
                break;
            case 3:
                // @ts-ignore
                begin = localTimetable.Wednesday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Wednesday.split("-")[1];
                break;
            case 4:
                // @ts-ignore
                begin = localTimetable.Thursday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Thursday.split("-")[1];
                break;
            case 5:
                // @ts-ignore
                begin = localTimetable.Friday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Friday.split("-")[1];
                break;
            case 6:
                // @ts-ignore
                begin = localTimetable.Saturday.split("-")[0];
                // @ts-ignore
                end = localTimetable.Saturday.split("-")[1];
                break;
        }

        // @ts-ignore
        let leftB = begin.split(":")[0];
        // @ts-ignore
        let rightB = begin.split(":")[1];

        // @ts-ignore
        let leftE = end.split(":")[0];
        // @ts-ignore
        let rightE = end.split(":")[1];

        if(time.split(":")[0] >= leftB && time.split(":")[0] < leftE && time.split(":")[1] >= rightB)
            return true
        else if(time.split(":")[0] >= leftB && time.split(":")[0] == leftE && time.split(":")[1] < rightE)
            return true
        else
            return false

        return false
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} title={title}>
            <Stack spacing={2} width={'100%'}>
                <TextField {...register('date_of_reception', {minLength: {value: 10, message: 'Поле должно содержать 10 символов'},
                                                                            maxLength: {value: 10, message: 'Поле должно содержать 10 символов'},
                                                                            pattern: {value: /^(?:(?:31(-)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(-)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(-)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(-)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/, message: 'Необходимый формат: DD-MM-YYYY'},
                                                                            required: {value: true, message: 'Обязательное поле'},
                                                                            validate: (date) => isDayOfWeek(date)})} label="Дата приёма" />
                <div style={{color: "red"}}>
                    {errors?.date_of_reception && <p>{errors?.date_of_reception?.message || "Врач не работает в эту дату"}</p>}
                </div>
                <TextField {...register('time_of_reception', {minLength: {value: 5, message: 'Поле должно содержать 5 символов'},
                                                                            maxLength: {value: 5, message: 'Поле должно содержать 5 символов'},
                                                                            pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM'},
                                                                            required: {value: true, message: 'Обязательное поле'},
                                                                            validate: (time) => isWorkTime(time) })} label="Время приёма" />
                <div style={{color: "red"}}>
                    {errors?.time_of_reception && <p>{errors?.time_of_reception?.message || "Врач не работает в данное время"}</p>}
                </div>

                {mappedListTim?.length && watch('doctor_id') != undefined &&
                    <InputLabel>
                    {mappedListTim?.map(({ doctorId, id, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }) => (
                        <span>
                            {
                                doctorId == doctorFrom.value &&
                                <Box key={id} border={'3px solid #4fe838'} sx={{ backgroundColor: '#bababa' }}>
                                    <div style={{ width: '100%' }}>Понедельник: {Monday}</div>
                                    <div style={{ width: '100%' }}>Вторник: {Tuesday}</div>
                                    <div style={{ width: '100%' }}>Среда: {Wednesday}</div>
                                    <div style={{ width: '100%' }}>Четверг: {Thursday}</div>
                                    <div style={{ width: '100%' }}>Пятница: {Friday}</div>
                                    <div style={{ width: '100%' }}>Суббота: {Saturday}</div>
                                </Box>
                            }
                        </span>
                    ))}
                    </InputLabel>}

                <InputLabel>Врач</InputLabel>
                <Controller
                    render={({ field}) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return <Select {...field} options={mappedListDoc} />;
                    }}
                    name={'doctor_id'}
                    control={control}
                    rules={{
                        required: {value: true, message: 'Обязательное поле'},
                    }}
                />
                <InputLabel>Пациент</InputLabel>
                <Controller
                    render={({ field }) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        return <Select {...field} options={mappedListPat} />;
                    }}
                    name={'patient_id'}
                    control={control}
                    rules={{
                        required: {value: true, message: 'Обязательное поле'},
                    }}
                />

                <Stack direction={'row'} justifyContent={'end'} spacing={2} width={'100%'}>
                    <Button type={'reset'} variant={'contained'} color={'primary'} onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button type={'submit'} variant={'contained'} color={'secondary'}>
                        {submitText}
                    </Button>
                </Stack>
            </Stack>
        </form>
    );
};