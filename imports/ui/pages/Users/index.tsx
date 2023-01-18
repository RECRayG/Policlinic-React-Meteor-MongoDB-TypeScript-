import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';

import { Loader } from '/imports/ui/shared/ui/Loader';
import { useMeteorCall } from '/imports/ui/shared/hooks/useMeteorCall';
import { ItemsList } from '/imports/ui/widgets/ItemsList';
import { UserModal } from '/imports/ui/components/UsersModal';
import { UserFields } from '/imports/ui/components/UsersModal/UsersForm';
import {RolesEnum, UserType} from '/imports/api/user';
import {Navigate, useNavigate} from "react-router-dom";
import onLogout = Accounts.onLogout;

export const UsersList = () => {
    const { data: clients, isLoading, request } = useMeteorCall<UserType[]>('user.get');
    const [createVisible, setCreateVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserType>();

    if (isLoading) {
        return <Loader />;
    }

    const mappedList = clients?.map(({ username, _id}) => ({
        info: `${username}`,
        id: _id,
    }));
    const toggleCreateVisible = () => {
        setCreateVisible((prev) => !prev);
    };

    const toggleEditVisible = () => {
        setEditVisible((prev) => !prev);
    };

    const onSubmitCreate = async (values: UserFields) => {
        // Только для врача при создании пользователя добавляем привязку к существующему врачу
        if(values.role.value == RolesEnum.DOCTOR) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const transformPayload = { ...values, doctorId: values.doctorId.value };
            await Meteor.callAsync('user.insertDoc', { ...transformPayload, role: values.role.value });
            toggleCreateVisible();
            await request();
        } else {
            await Meteor.callAsync('user.insert', { ...values, role: values.role.value });
            toggleCreateVisible();
            await request();
        }

    };

    const onSubmitEdit = async (values: UserFields) => {
        if(values.role.value == RolesEnum.DOCTOR) {
            await Meteor.callAsync('user.updateDoc', {
                userId: currentUser?._id,
                username: values.username,
                role: values.role.value,
                doctorId: values.doctorId.value,
                currRole: currentUser?.role,
            });
            toggleEditVisible();
            await request();
        } else {
            await Meteor.callAsync('user.update', {
                userId: currentUser?._id,
                username: values.username,
                role: values.role.value,
            });
            toggleEditVisible();
            await request();
        }
    };

    const onEdit = async (id: string) => {
        const user = await Meteor.callAsync('user.getById', { id });
        setCurrentUser(user);
        toggleEditVisible();
    };
    const onDelete = async (id: string) => {
        Meteor.call('user.remove', { userId: id });
        await request();
    };

    return (
        <>
            <ItemsList
                data={mappedList ?? []}
                title={'Пользователи'}
                onDeleteItem={onDelete}
                onEditItem={onEdit}
                onCreate={toggleCreateVisible}
            />
            <UserModal visible={createVisible} onClose={toggleCreateVisible} onSubmit={onSubmitCreate} />
            <UserModal
                onClose={toggleEditVisible}
                visible={editVisible}
                user={currentUser}
                onSubmit={onSubmitEdit}
                submitText={'Сохранить'}
            />
        </>
    );
};
