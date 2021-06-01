import { existingUser } from "../../../mock-data/user.mocks";
import { QueryTestId } from "../../enums";
import bcrypt from 'bcrypt';
import { 
    userWithLikes, 
    userWithMostLikes, 
    userWithoutLikes 
} from "../../../mock-data/like.mocks";

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

        if (queryTestId === QueryTestId.CreateUser) {
            return;
        }

        if (queryTestId === QueryTestId.GetMostLiked) {
            return [
                userWithMostLikes,
                userWithLikes,
                userWithoutLikes,
            ];
        }

        if (queryTestId === QueryTestId.GetUserLikes) {
            return [userWithoutLikes]   
        }

        if (
            queryTestId === QueryTestId.CreateLike
            || queryTestId === QueryTestId.DeleteLike    
        ) {
            return;
        }
    }
}