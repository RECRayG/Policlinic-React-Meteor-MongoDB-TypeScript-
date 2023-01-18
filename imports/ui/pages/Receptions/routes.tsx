import React from 'react';

import { ReceptionView } from './PageReceptionsView';

import { ReceptionsList } from './index';

export const routes = {
    list: '/receptions',
    view: '/receptions/view/:id',
};

export const receptionsRoutes = [
    {
        path: routes.list,
        element: <ReceptionsList />,
    },
    {
        path: routes.view,
        element: <ReceptionView />,
    },
];
