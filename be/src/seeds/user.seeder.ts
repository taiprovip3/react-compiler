import * as bcrypt from 'bcrypt';
import { AppDataSource } from 'src/config/data-source';
import { User } from 'src/entities/user.entity';

export const seedUsers = async () => {
  const userRepository = AppDataSource.getRepository(User);
  const user = userRepository.create({
    username: 'user011',
    email: 'user011@gmail.com',
    password: await bcrypt.hash('12312az', 10),
  });
  await userRepository.save(user);
};
