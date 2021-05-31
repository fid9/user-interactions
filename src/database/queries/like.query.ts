export const likeUserQuery = `
INSERT INTO 
likes (sender_user, receiver_user, created_at, updated_at)
VALUES (:senderUsername, :receiverUsername, NOW(), NOW())
ON DUPLICATE KEY
UPDATE id = id;
`