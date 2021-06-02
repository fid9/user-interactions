# Fidan_Sinani_NodeJS

## Migrations

install sequelize-cli `npm install -g sequelize-cli@5.5.1`

- db-migrate-up: `sequelize-cli db:migrate`
- db-migrate-down: `sequelize-cli db:migrate:undo`
- db-seed-up: `sequelize-cli db:seed:all`
- db-seed-down: `sequelize-cli db:seed:undo:all`

# Database decision

I chose MySQL for no particular reason except that i'm more comfortable with it, even tho MongoDB would be the obvious choice here (which i'm familiar with aswell). As for PostgreSQL, since it is destined for more complex queries and giant databases, i found it an unnecessary addition for this project.

If you have any trouble running themysql docker container, you can use these credentials for an up-and-running third party server:

- `MYSQL_USER=sql4416141`
- `MYSQL_PASSWORD=ICdKUtltJI`
- `MYSQL_DATABASE=sql4416141`
- `MYSQL_HOST=sql4.freemysqlhosting.net`