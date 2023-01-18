import React from 'react';

import { DoctorView } from './PageDoctorsView';

import { DoctorsList } from './index';

export const routes = {
    list: '/doctors',
    view: '/doctors/view/:id',
};

export const doctorsRoutes = [
    {
        path: routes.list,
        element: <DoctorsList />,
    },
    {
        path: routes.view,
        element: <DoctorView />,
    },
];
