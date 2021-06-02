export const likeUserQuery = `
INSERT INTO 
likes (sender_user, receiver_user, created_at, updated_at)
VALUES (:senderUsername, :receiverUsername, NOW(), NOW())
ON DUPLICATE KEY
UPDATE id = id;
`;

export const unlikeUserQuery = `
DELETE FROM likes
WHERE sender_user = :senderUsername
AND receiver_user = :receiverUsername;
`;

export const getUserLikesQuery = `
SELECT sender_user as senderUser 
FROM likes
WHERE receiver_user = :username;
`;

export const getAllLikesQuery = `
SELECT COUNT(*) as count, receiver_user AS username
FROM likes
GROUP by receiver_user
UNION
SELECT 0 as count, username
FROM users u
LEFT JOIN likes l
ON u.username = l.receiver_user
WHERE l.receiver_user IS NULL;
`;
