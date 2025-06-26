import { Pool } from 'pg'

export const pool = new Pool({
    user: 'postgres.jcozwjesouhvqxgbdijp',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'Unify',
    password: 'UnifyHeap2025',
    port: 5432
})

// my local database
export const local = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Unify',
    password: 'password',
    port: 5432
})

/*  Main db details
    user: 'postgres.jcozwjesouhvqxgbdijp',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'Unify',
    password: 'UnifyHeap2025',
    port: 5432 */

// export default pool
