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

export const ReceptionProcedures: React.FC<UserFormProps> = ({
                                                                reception,
                                                                onSubmit,
                                                                submitText = 'Сохранить процедуры',
                                                            }) => {
    const {
        register,
        watch,
        handleSubmit
    } = useForm<ReceptionFields>({
        defaultValues: reception,
        mode: "onSubmit"
    });

    const proceduresNew = watch('procedures');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/*<>*/}
            <h2>Процедуры</h2>
            {!reception?.date_of_extract && <TextareaAutosize {...register('procedures')} className="TextareaAutosizeStyle" minRows={5} defaultValue={reception?.procedures}></TextareaAutosize>}
            {reception?.date_of_extract && <TextareaAutosize className="TextareaAutosizeExplainStyle" minRows={5} defaultValue={reception?.procedures} readOnly={true} style={{cursor: 'default'}}></TextareaAutosize>}
            <div>
                {!reception?.date_of_extract && <Button className="ButtonStyle" type={'submit'} variant={'contained'} color={'primary'}>
                    {submitText}
                </Button>}
            </div>
            {/*</>*/}
        </form>
    )
}