import { Sequelize } from 'sequelize'
const sequelize = new Sequelize('Unify', 'postgres.jcozwjesouhvqxgbdijp', 'UnifyHeap2025',
  {
    host: 'aws-0-ap-southeast-1.pooler.supabase.com',
    dialect: 'postgres'
  }
)
try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

export default sequelize