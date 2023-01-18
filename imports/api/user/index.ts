import './userMethods';
import './userPublications';

export enum RolesEnum {
    ADMIN = 'admin',
    DOCTOR = 'doctor'
}
export type UserType = {
    username: string;
    _id: string;
    role: RolesEnum;
    doctorId: string;
};
