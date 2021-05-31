import { QueryTypes } from "sequelize";
import { likeUserQuery } from "../database/queries/like.query";
import { database } from "../database/connection";

export default class LikeService {
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
}