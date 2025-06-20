const { Pool } = require('pg')
const pool = new Pool({
    // user: 'postgres',
    // host: 'localhost',
    // database: 'Unify',
    // password: 'password',
    // port: 5432
    user: 'postgres.jcozwjesouhvqxgbdijp',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'Unify',
    password: 'UnifyHeap2025',
    port: 5432
})



module.exports = pool