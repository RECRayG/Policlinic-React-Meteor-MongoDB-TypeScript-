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

export const ReceptionComplaints: React.FC<UserFormProps> = ({
                                                           reception,
                                                           onSubmit,
                                                           submitText = 'Сохранить жалобу',
                                                       }) => {
    const {
        register,
        watch,
        handleSubmit
    } = useForm<ReceptionFields>({
        defaultValues: reception,
        mode: "onSubmit"
    });

    const complaintsNew = watch('complaints');

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
        {/*<>*/}
            <h2>Жалобы</h2>
            {!reception?.date_of_extract && <TextareaAutosize {...register('complaints')} className="TextareaAutosizeStyle" minRows={5} defaultValue={reception?.complaints}></TextareaAutosize>}
            {reception?.date_of_extract && <TextareaAutosize className="TextareaAutosizeExplainStyle" minRows={5} defaultValue={reception?.complaints} readOnly={true} style={{cursor: 'default'}}></TextareaAutosize>}
            <div>
                {!reception?.date_of_extract && <Button className="ButtonStyle" type={'submit'} variant={'contained'} color={'primary'}>
                    {submitText}
                </Button>}
            </div>
        {/*</>*/}
        </form>
    )
}