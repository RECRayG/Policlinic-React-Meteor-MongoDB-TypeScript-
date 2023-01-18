import React from 'react';

import {Controller, useForm} from 'react-hook-form';

import {Button, InputLabel, TextareaAutosize} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import {RolesEnum, UserType} from '/imports/api/user';

import {Select} from '../../shared/ui/Select';
import {Doctor} from "/imports/api/doctors";
import {useMeteorCall} from "/imports/ui/shared/hooks/useMeteorCall";
import "/imports/ui/pages/Timetable/TextareaAutosizeMessageStyle.css";

export interface UserFields {
    username: string;
    password?: string;
    role: { value: string; label: string };
    doctorId?: string;
}
interface UserFormProps {
    title: string;
    onSubmit: (values: UserFields) => void;
    onCancel: () => void;
    user?: UserType;
    submitText?: string;
}

const roleMap = {
    [RolesEnum.ADMIN]: 'Админ',
    [RolesEnum.DOCTOR]: 'Врач',
};

export const UserForm: React.FC<UserFormProps> = ({ title, user, onSubmit, submitText = 'Создать', onCancel }) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
        control,
        watch
    } = useForm<UserFields>({
        defaultValues: {
            ...user,
            role: user?.role
                ? {
                    value: user.role,
                    label: roleMap[user?.role],
                }
                : undefined,
        },
        mode: "onSubmit"
    });

    const doctorChoose = watch('role')

    const { data: doctors } = useMeteorCall<Doctor[]>('doctors.get');
    const { data: users } = useMeteorCall<UserType[]>('user.get');

    const mappedListUsers = users?.map(({ username, _id, doctorId }) => ({
        info: `${username}`,
        id: _id,
        doctor_id: doctorId,
    }));

    // Добавление в выпадающий список только тех врачей, у которых нет аккаунта
    // @ts-ignore
    const mappedListDoc = doctors?.map(({ lastname, firstname, middlename, specialization, _id }) => ({
        label: `${lastname} ${firstname} ${middlename} - ${specialization}`,
        value: _id,
    }));//.filter(doc => mappedListUsers.findIndex(i => i.doctor_id != doc.value) === -1);

    const listDoc = [{label: '', value:''}];
    if(doctorChoose != undefined && doctorChoose.value == RolesEnum.DOCTOR) {
        if(mappedListDoc != undefined && mappedListUsers != undefined) {
            let k = 0;
            let b = 1;
            for(let i = 0; i < mappedListDoc.length; i++) {
                b = 1;
                for(let j = 0; j < mappedListUsers.length; j++) {
                    if(mappedListDoc[i].value == mappedListUsers[j].doctor_id) {
                        b = 0;
                        break;
                    }
                }

                if(b == 1) {
                    listDoc[k++] = mappedListDoc[i];
                }
            }
        }
    }

    const isEmpty = (localRole: string) => {
        if(localRole == '' || localRole == undefined)
            return false;
        else
            return true;
    }

    const isExist = (name: string) => {
        if (users?.filter(user => user.username == name) == undefined)
            return false;
        else
            return true;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} title={title}>
            <Stack spacing={2} width={'100%'}>
                <TextField {...register('username', {validate: (name) => isExist(name) })} name="username" label="Имя пользователя" />
                <div style={{color: "red"}}>
                    {errors?.username && <p>{"Пользователь с таким именем уже существует"}</p>}
                </div>
                {!user && <><TextField {...register('password')} name="password" label="Пароль" type="password" />
                    <div style={{color: "red"}}>
                        {errors?.password && <p>{"Обязательное поле"}</p>}
                    </div></>}
                {doctorChoose != undefined && doctorChoose.value == RolesEnum.DOCTOR && listDoc[0].value != '' && listDoc.length >= 1 && submitText != 'Сохранить' &&
                    <div>
                        <InputLabel>Привязка врача к новому аккаунту</InputLabel>
                        <Controller
                            render={({ field}) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                return <Select {...field} options={listDoc} />;
                            }}
                            name={'doctorId'}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Обязательное поле'},
                                validate: (localRole) => isEmpty(localRole)
                            }}
                        />
                        <div style={{color: "red"}}>
                            {errors?.doctorId && <p>{errors?.doctorId?.message || "Врач не выбран"}</p>}
                        </div>
                    </div>
                }
                {doctorChoose != undefined && doctorChoose.value == RolesEnum.DOCTOR && user?.role == RolesEnum.ADMIN && listDoc[0].value != '' && listDoc.length >= 1 && submitText == 'Сохранить' &&
                    <div>
                        <InputLabel>Привязка врача к новому аккаунту</InputLabel>
                        <Controller
                            render={({ field}) => {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                return <Select {...field} options={listDoc} />;
                            }}
                            name={'doctorId'}
                            control={control}
                            rules={{
                                required: {value: true, message: 'Обязательное поле'},
                                validate: (localRole) => isEmpty(localRole)
                            }}
                        />
                        <div style={{color: "red"}}>
                            {errors?.doctorId && <p>{errors?.doctorId?.message || "Врач не выбран"}</p>}
                        </div>
                    </div>
                }
                {   doctorChoose != undefined && doctorChoose.value == RolesEnum.DOCTOR && listDoc[0].value == '' && listDoc.length == 1 && submitText != 'Сохранить' &&
                    <TextareaAutosize {...register('doctorId', {required: true})} minRows={5} readOnly={true} placeholder={'Все врачи имеют свои аккаунты'} className="TextareaAutosizeStyleMessage"></TextareaAutosize>
                }
                {   doctorChoose != undefined && doctorChoose.value == RolesEnum.DOCTOR && user?.role == RolesEnum.ADMIN && listDoc[0].value == '' && listDoc.length == 1 && submitText == 'Сохранить' &&
                    <TextareaAutosize {...register('doctorId', {required: true})} minRows={5} readOnly={true} placeholder={'Все врачи имеют свои аккаунты'} className="TextareaAutosizeStyleMessage"></TextareaAutosize>
                }
                <InputLabel>Роль</InputLabel>
                <Controller
                    render={({ field }) => {
                        return (
                            <Select
                                {...field}
                                options={[
                                    { value: RolesEnum.ADMIN, label: 'Админ' },
                                    { value: RolesEnum.DOCTOR, label: 'Врач' },
                                ]}
                            />
                        );
                    }}
                    name={'role'}
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
