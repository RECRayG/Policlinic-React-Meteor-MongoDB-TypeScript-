import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

import { RolesEnum } from '/imports/api/user/';
import '/imports/api/doctors/';
import '/imports/api/timetable/';
import '/imports/api/patients/';
import '/imports/api/receptions/';
import '/imports/api/analyses/';
import '/imports/api/medications/';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'admin';

Meteor.startup(async () => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    const user = Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    //Meteor.user
    Meteor.users.update(user, {
      $set: {
        role: RolesEnum.ADMIN,
      },
    });
  }

  console.log( Meteor.server.publish_handlers );
});