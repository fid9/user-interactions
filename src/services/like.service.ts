import { QueryTypes } from "sequelize";
import { 
    likeUserQuery, 
    unlikeUserQuery, 
    getUserLikesQuery, 
    getAllLikesQuery
} from "../database/queries/like.query";
import { database } from "../database/connection";
import { GetUserLikesResponse } from "../interfaces/GetUserLikesResponse";
import { GetAllLikesResponse } from "../interfaces/GetAllLikesResponse";
import { QueryTestId } from "../enums";

export default class LikeService {
    static get = async (
        username: string,
    ): Promise<string[]> => {
        const results = await database.query<GetUserLikesResponse>(
            getUserLikesQuery,
            {
                replacements: {
                    username,
                    QueryTestId: QueryTestId.GetUserLikes
                },
                type: QueryTypes.SELECT,
                raw: true,
            }
        )

        const likes = results.map(like => like.senderUser);

        return likes;
    }

    static getAll = async(): Promise<GetAllLikesResponse[]> => {
        const results = await database.query<GetAllLikesResponse>(
            getAllLikesQuery,
            {
                type: QueryTypes.SELECT,
                raw: true,
                replacements: {
                    QueryTestId: QueryTestId.GetMostLiked,
                }
            }
        )

        return results;
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