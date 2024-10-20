import pgPromise from "pg-promise";
const pgp = pgPromise();

const db = pgp({
    user: 'postgres',
    host: 'localhost',
    database: 'mydb',
    password: 'rawqer22',
    port: 5432
    
    })



export default db