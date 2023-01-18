// @ts-ignore
import React from "react";
import {Navigate, useRoutes} from "react-router-dom";
import { LoginForm } from './components/LoginForm';
import { PublicRoute } from './components/PublicRoute';
// @ts-ignore
import { RoleRoute } from '/imports/ui/components/RoleRoute';
// @ts-ignore
import { RolesEnum } from '/imports/api/user';
import { ProtectedRoute } from "./components/ProtectedRoute";
import {doctorsRoutes} from "/imports/ui/pages/Doctors/routes";
import {timetableRoutes} from "/imports/ui/pages/Timetable/routes";
import {patientsRoutes} from "/imports/ui/pages/Patients/routes";
import {usersRoutes} from "/imports/ui/pages/Users/routes";
import {receptionsRoutes} from "/imports/ui/pages/Receptions/routes";

export const App = () => {
    return useRoutes([
        {
            element: <ProtectedRoute />,
            children: [
                ...doctorsRoutes,
                ...timetableRoutes,
                ...patientsRoutes,
                ...receptionsRoutes,
            ],
        },
        {
            element: <PublicRoute />,
            children: [{ path: '/login', element: <LoginForm /> }],
        },
        {
            element: <RoleRoute roles={[RolesEnum.ADMIN]} />,
            children: [...usersRoutes],
        },
        {
            element: <Navigate to={'/receptions'} />,
            path: '*',
        },
    ]);


    // return useRoutes([
    //     {
    //         element: <PublicRoute />,
    //         children: [{ path: '/login', element: <LoginForm /> }],
    //     }
    // ])
}