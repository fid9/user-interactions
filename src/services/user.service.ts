import {
    createUserQuery,
    getUserQuery,
    updatePasswordQuery
} from "../database/queries/user.query";

import bcrypt from 'bcrypt';
import { database } from "../database/connection";
import { QueryTypes } from "sequelize";
import { User } from "../interfaces/User";
import { CreateUserResponse } from "../interfaces/CreateUserResponse";
import { ErrorType } from "../enums";

export default class UserService {
    static get = async (
        username: string,
    ): Promise<User> => {
        const [user] = await database.query<User>(
            getUserQuery,
            {
                replacements: {
                    username,
                },
                type: QueryTypes.SELECT,
                raw: true,
            }
        );
        
        return user;
    }

    static create = async (
        username: string,
        plainPassword: string,
    ): Promise<CreateUserResponse> => {
        try {
            const existingUser = await UserService.get(username);

            if (existingUser) {
                return {
                    error: ErrorType.UserAlreadyExists,
                }
            }

            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            await database.query(
                createUserQuery,
                {
                    replacements: {
                        username,
                        password: hashedPassword
                    },
                    type: QueryTypes.INSERT
                }
            );

            return { username }
        } catch (err) {
            console.log(err);

            return {
                error: ErrorType.UserCouldNotBeCreated,
            };
        }
    };

    static updatePassword = async (
        username: string,
        newPassword: string,
    ): Promise<void> => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await database.query(
            updatePasswordQuery,
            {
                replacements: {
                    username,
                    password: hashedPassword
                },
                type: QueryTypes.UPDATE
            }
        );
    }
}