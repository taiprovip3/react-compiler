import { AppDataSource } from 'src/config/data-source';
import { seedUsers } from './user.seeder';

AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Data Source has been initialized!');

    await seedUsers();

    console.log('🌱 Seeding done!');
    await AppDataSource.destroy();
  })
  .catch((err) => {
    console.error('❌ Error during Data Source initialization', err);
  });
