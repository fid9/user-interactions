import { QueryTypes } from "sequelize";
import { 
    likeUserQuery, 
    unlikeUserQuery, 
    getUserLikesQuery 
} from "../database/queries/like.query";
import { database } from "../database/connection";
import { GetUserLikesResponse } from "../interfaces/GetUserLikesResponse";

export default class LikeService {
    static get = async (
        username: string,
    ): Promise<string[]> => {
        const results = await database.query<GetUserLikesResponse>(
            getUserLikesQuery,
            {
                replacements: {
                    username,
                },
                type: QueryTypes.SELECT,
                raw: true,
            }
        )

        const likes = results.map(like => like.senderUser);

        return likes;
    }

    static create = async (
        senderUsername: string,
        receiverUsername: string
    ): Promise<void> => {
        await database.query(
            likeUserQuery,
            {
                replacements: {
                    senderUsername,
                    receiverUsername
                },
                type: QueryTypes.INSERT
            }
        );
    }

    static delete = async (
        senderUsername: string,
        receiverUsername: string
    ): Promise<void> => {
        await database.query(
            unlikeUserQuery,
            {
                replacements: {
                    senderUsername,
                    receiverUsername
                },
                type: QueryTypes.DELETE
            }
        );
    }
}