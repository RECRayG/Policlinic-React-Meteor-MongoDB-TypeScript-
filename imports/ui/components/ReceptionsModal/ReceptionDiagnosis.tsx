import {Reception} from "/imports/api/receptions";
import React from "react";
import {useForm} from "react-hook-form";
import {Button, TextareaAutosize} from "@mui/material";
import "/imports/ui/pages/Receptions/TextareaAutosizeStyle.css";
import "/imports/ui/pages/Receptions/ButtonStyle.css";

export type ReceptionFields = Omit<Reception, '_id'>;
interface UserFormProps {
    onSubmit: (values: ReceptionFields) => void;
    reception?: Reception;
    submitText?: string;
}

export const ReceptionDiagnosis: React.FC<UserFormProps> = ({
                                                                 reception,
                                                                 onSubmit,
                                                                 submitText = 'Сохранить диагноз',
                                                             }) => {
    const {
        register,
        watch,
        handleSubmit
    } = useForm<ReceptionFields>({
        defaultValues: reception,
        mode: "onSubmit"
    });

    const diagnosisNew = watch('diagnosis');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/*<>*/}
            <h2>Диагноз</h2>
            {!reception?.date_of_extract && <TextareaAutosize {...register('diagnosis')} className="TextareaAutosizeStyle" minRows={5} defaultValue={reception?.diagnosis}></TextareaAutosize>}
            {reception?.date_of_extract && <TextareaAutosize className="TextareaAutosizeExplainStyle" minRows={5} defaultValue={reception?.diagnosis} readOnly={true} style={{cursor: 'default'}}></TextareaAutosize>}
            <div>
                {!reception?.date_of_extract && <Button className="ButtonStyle" type={'submit'} variant={'contained'} color={'primary'}>
                    {submitText}
                </Button>}
            </div>
            {/*</>*/}
        </form>
    )
}