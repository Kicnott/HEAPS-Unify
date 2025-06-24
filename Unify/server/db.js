import { Pool } from 'pg'
const pool = new Pool({
    user: 'postgres.jcozwjesouhvqxgbdijp',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'Unify',
    password: 'UnifyHeap2025',
    port: 5432
})

/*  Main db details
    user: 'postgres.jcozwjesouhvqxgbdijp',
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    database: 'Unify',
    password: 'UnifyHeap2025',
    port: 5432 */

export default pool
