import React from 'react';

import ReactInputMask from 'react-input-mask';
import { Controller, useForm } from 'react-hook-form';

import {Button, InputLabel, TextareaAutosize} from '@mui/material';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {Analysis} from "/imports/api/analyses";


export type AnalysisFields = Omit<Analysis, '_id'>;
interface UserFormProps {
    title: string;
    onSubmit: (values: AnalysisFields) => void;
    onCancel: () => void;
    analysis?: Analysis;
    submitText?: string;
}

export const AnalysisForm: React.FC<UserFormProps> = ({
                                                        title,
                                                        analysis,
                                                        onSubmit,
                                                        submitText = 'Создать',
                                                        onCancel,
                                                    }) => {
    const {
        register,
        formState: {errors},
        handleSubmit,
    } = useForm<AnalysisFields>({
        defaultValues: analysis,
    });

    console.log('analysis inside', analysis);

    return (
        <form onSubmit={handleSubmit(onSubmit)} title={title}>
            <Stack spacing={2} width={'100%'}>
                <TextField {...register('analysis', {required: true})} label="Наименование анализа" />
                <div style={{color: "red"}}>
                    {errors?.analysis && <p>{errors?.analysis?.message || "Обязательное поле"}</p>}
                </div>
                {   submitText == 'Сохранить' &&
                    <>
                        <TextareaAutosize {...register('analysis_result', {required: true})} placeholder={"Результат анализа"} className="TextareaAutosizeAnalysesStyle" minRows={1} defaultValue={analysis?.analysis_result}></TextareaAutosize>
                        <div style={{color: "red"}}>
                            {errors?.analysis_result && <p>{errors?.analysis_result?.message || "Обязательное поле"}</p>}
                        </div>
                    </>
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
