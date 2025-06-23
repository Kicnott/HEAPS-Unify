import { Pool } from 'pg'
const pool = new Pool({
    user: 'nicholas',
    host: 'localhost',
    database: 'Unify-Test',
    password: 'root',
    port: 5432
})

export default pool