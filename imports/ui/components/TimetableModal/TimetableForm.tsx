import React, {useState} from 'react';

import ReactInputMask from 'react-input-mask';
import { Controller, useForm } from 'react-hook-form';

import {Button, InputLabel, TextareaAutosize} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Select } from '/imports/ui/shared/ui/Select';
import {Timetable} from "/imports/api/timetable/TimetableCollection";
import { Doctor } from '/imports/api/doctors';
import {useMeteorCall} from "/imports/ui/shared/hooks/useMeteorCall";
import "/imports/ui/pages/Timetable/TextareaAutosizeMessageStyle.css";

export type TimetableFields = Omit<Timetable, '_id'>;
interface UserFormProps {
    title: string;
    onSubmit: (values: TimetableFields) => void;
    onCancel: () => void;
    timetable?: Timetable;
    submitText?: string;
}

export const TimetableForm: React.FC<UserFormProps> = ({
                                                        title,
                                                        timetable,
                                                        onSubmit,
                                                        submitText = 'Создать',
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
    } = useForm<TimetableFields>({
        defaultValues: timetable,
        mode: "onSubmit"
    });

    const currDoctor = watch('doctor_id');
    
    console.log('timetable inside', timetable);

    const { data: doctors } = useMeteorCall<Doctor[]>('doctors.get');
    const mappedListD = doctors?.map(({ lastname, firstname, middlename, specialization, _id }) => ({
        label: `${lastname} ${firstname} ${middlename} - ${specialization}`,
        value: _id,
    }));

    const { data: timetables } = useMeteorCall<Timetable[]>('timetable.get');
    const mappedListT = timetables?.map(({ doctor_id, _id }) => ({
        doctor_id: doctor_id,
        value: _id,
    }));

    const listDoc = [{label: '', value:''}]; // Список врачей, у которых ещё нет расписания
    if(mappedListD != undefined && mappedListT != undefined) {
        let k = 0;
        let b = 1;
        for(let i = 0; i < mappedListD.length; i++) {
            b = 1;
            for(let j = 0; j < mappedListT.length; j++) {
                if(mappedListD[i].value == mappedListT[j].doctor_id) {
                    b = 0;
                    break;
                }
            }

            if(b == 1) {
                listDoc[k++] = mappedListD[i];
            }
        }

        console.log(listDoc);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} title={title}>
            <Stack spacing={2} width={'100%'}>
                <TextField {...register('monday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Понедельник" />
                <div style={{color: "red"}}>
                    {errors?.monday && <p>{errors?.monday?.message || "Ошибка заполнения"}</p>}
                </div>
                <TextField {...register('tuesday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                 maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                 pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Вторник" />
                <div style={{color: "red"}}>
                    {errors?.tuesday && <p>{errors?.tuesday?.message || "Ошибка заполнения"}</p>}
                </div>
                <TextField {...register('wednesday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                   maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                   pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Среда" />
                <div style={{color: "red"}}>
                    {errors?.wednesday && <p>{errors?.wednesday?.message || "Ошибка заполнения"}</p>}
                </div>
                <TextField {...register('thursday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                  maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                  pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Четверг" />
                <div style={{color: "red"}}>
                    {errors?.thursday && <p>{errors?.thursday?.message || "Ошибка заполнения"}</p>}
                </div>
                <TextField {...register('friday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Пятница" />
                <div style={{color: "red"}}>
                    {errors?.friday && <p>{errors?.friday?.message || "Ошибка заполнения"}</p>}
                </div>
                <TextField {...register('saturday', {minLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                  maxLength: {value: 11, message: 'Поле должно содержать 11 символов'},
                                                                  pattern: {value: /^(([0,1][0-9])|(2[0-3])):[0-5][0-9][-](([0,1][0-9])|(2[0-3])):[0-5][0-9]$/, message: 'Необходимый формат: HH:MM-HH:MM'}})} label="Суббота" />
                <div style={{color: "red"}}>
                    {errors?.saturday && <p>{errors?.saturday?.message || "Ошибка заполнения"}</p>}
                </div>
                {   listDoc[0].value != '' && listDoc.length >= 1 && submitText != "Сохранить" &&
                    <>
                        <InputLabel>Врач</InputLabel>
                        <Controller
                            render={({ field }) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                return <Select {...field} options={listDoc} />;
                            }}
                            name={'doctor_id'}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Обязательное поле'},
                            }}
                        />
                    </>
                }
                {   listDoc[0].value == '' && listDoc.length == 1 && submitText != "Сохранить" &&
                    <TextareaAutosize {...register('doctor_id', {required: true})} minRows={5} readOnly={true} placeholder={'У всех врачей установлено расписание'} className="TextareaAutosizeStyleMessage"></TextareaAutosize>
                }

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