import React, { VFC } from 'react';

import { Box, Modal } from '@mui/material';

import { Reception } from '/imports/api/receptions';
import { ReceptionFields, ReceptionForm } from '/imports/ui/components/ReceptionsModal/ReceptionsForm';

type Props = {
    onClose: () => void;
    visible: boolean;
    reception?: Reception;
    submitText?: string;
    onSubmit: (values: ReceptionFields) => void;
};

type PropsUpdate = {
    reception?: Reception;
    submitText?: string;
    onSubmit: (values: ReceptionFields) => void;
};

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    padding: '20px',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
};

export const ReceptionModal: VFC<Props> = (props) => {
    return (
        <Modal open={props.visible}>
            <Box sx={style}>
                <ReceptionForm title="Назначить приём" onCancel={props.onClose} {...props} />
            </Box>
        </Modal>
    );
};

export const ReceptionComplaints: VFC<PropsUpdate> = (props) => {
    return (
        <ReceptionComplaints {...props} />
    );
};

export const ReceptionDiagnosis: VFC<PropsUpdate> = (props) => {
    return (
        <ReceptionDiagnosis {...props} />
    );
};

export const ReceptionProcedures: VFC<PropsUpdate> = (props) => {
    return (
        <ReceptionProcedures {...props} />
    );
};