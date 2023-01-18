import React, { VFC } from 'react';

import { Box, Modal } from '@mui/material';

import { Medication } from '/imports/api/medications';
import { MedicationFields, MedicationForm } from '/imports/ui/components/MedicationsModal/MedicationsForm';

type Props = {
    onClose: () => void;
    visible: boolean;
    medication?: Medication;
    submitText?: string;
    onSubmit: (values: MedicationFields) => void;
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

export const MedicationModal: VFC<Props> = (props) => {
    return (
        <Modal open={props.visible}>
            <Box sx={style}>
                <MedicationForm title="Добавить лекарство" onCancel={props.onClose} {...props} />
            </Box>
        </Modal>
    );
};
