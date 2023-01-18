import React from 'react';

import { TimetableList } from './index';

export const routes = {
    list: '/timetable',
};

export const timetableRoutes = [
    {
        path: routes.list,
        element: <TimetableList />,
    },
];
