import * as migration_20260322_233106_initial from './20260322_233106_initial';
import * as migration_20260403_095525_add_role_to_users from './20260403_095525_add_role_to_users';

export const migrations = [
  {
    up: migration_20260322_233106_initial.up,
    down: migration_20260322_233106_initial.down,
    name: '20260322_233106_initial',
  },
  {
    up: migration_20260403_095525_add_role_to_users.up,
    down: migration_20260403_095525_add_role_to_users.down,
    name: '20260403_095525_add_role_to_users'
  },
];
