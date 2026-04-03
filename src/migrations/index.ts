import * as migration_20260322_233106_initial from './20260322_233106_initial';
import * as migration_20260403_095525_add_role_to_users from './20260403_095525_add_role_to_users';
import * as migration_20260403_102452_add_Categorise from './20260403_102452_add_Categorise';

export const migrations = [
  {
    up: migration_20260322_233106_initial.up,
    down: migration_20260322_233106_initial.down,
    name: '20260322_233106_initial',
  },
  {
    up: migration_20260403_095525_add_role_to_users.up,
    down: migration_20260403_095525_add_role_to_users.down,
    name: '20260403_095525_add_role_to_users',
  },
  {
    up: migration_20260403_102452_add_Categorise.up,
    down: migration_20260403_102452_add_Categorise.down,
    name: '20260403_102452_add_Categorise'
  },
];
