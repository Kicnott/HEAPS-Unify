export default {
    HOST: "aws-0-ap-southeast-1.pooler.supabase.com",
    USER: "postgres.jcozwjesouhvqxgbdijp",
    PASSWORD: "UnifyHeap2025",
    DB: "Unify",
    PORT: 5432,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};