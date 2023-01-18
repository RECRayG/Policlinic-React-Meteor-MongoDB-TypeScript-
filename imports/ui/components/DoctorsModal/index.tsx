import React, { VFC } from 'react';

import { Box, Modal } from '@mui/material';

import { Doctor } from '/imports/api/doctors';
import { DoctorFields, DoctorForm } from '/imports/ui/components/DoctorsModal/DoctorsForm';

type Props = {
    onClose: () => void;
    visible: boolean;
    doctor?: Doctor;
    submitText?: string;
    onSubmit: (values: DoctorFields) => void;
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

export const DoctorModal: VFC<Props> = (props) => {
    return (
        <Modal open={props.visible}>
            <Box sx={style}>
                <DoctorForm title="Создать врача" onCancel={props.onClose} {...props} />
            </Box>
        </Modal>
    );
};
