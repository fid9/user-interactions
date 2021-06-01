import { existingUser } from "../../../mock-data/user.mocks";
import { QueryTestId } from "../../enums";
export const database = {
    query: (_query: string, options: any): any => {
        if (
            options.replacements.QueryTestId === QueryTestId.GetUser
        ) {
            if (
                options.replacements.username === existingUser.username
            ) {
                return [existingUser];
            }
            
            return [];
        }

        if (options.replacements.QueryTestId === QueryTestId.CreateUser) {
            return;
        }
    }
}