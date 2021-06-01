import { existingUser } from "../../../mock-data/user.mocks";
import { QueryTestId } from "../../enums";
import bcrypt from 'bcrypt';

export const database = {
    query: async (_query: string, options: any): Promise<any> => {
        const { QueryTestId: queryTestId, username } = options.replacements;
        if (queryTestId === QueryTestId.GetUser) {
            if (username === existingUser.username) {
                const password = await bcrypt.hash(
                    existingUser.rawPassword, 10
                );

                existingUser.password = password;

                return [existingUser];
            }
            
            return [];
        }

        if (options.replacements.QueryTestId === QueryTestId.CreateUser) {
            return;
        }
    }
}