import React from 'react';

import { PatientView } from './PagePatientsView';

import { PatientsList } from './index';

export const routes = {
    list: '/patients',
    view: '/patients/view/:id',
};

export const patientsRoutes = [
    {
        path: routes.list,
        element: <PatientsList />,
    },
    {
        path: routes.view,
        element: <PatientView />,
    },
];
