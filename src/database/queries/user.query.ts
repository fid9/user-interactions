export const getUserQuery = `
SELECT
id, 
username,
password,
created_at AS createdAt,
updated_at AS updatedAt
FROM users
WHERE username = :username
LIMIT 1;
`;

export const createUserQuery = `
INSERT INTO
users (username, password, created_at, updated_at)
VALUES (:username, :password, NOW(), NOW());
`;