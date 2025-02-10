
import { userSchemaFactory, User } from '@modules/users/schemas/users.schemas';

export const USERS = { name: User.name, useFactory: userSchemaFactory };

