import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { createInterface } from 'node:readline/promises';
import { Profile, User, UserRole } from '../database/entities';
import { scryptSync } from 'node:crypto';
config();

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Profile],
});

async function main() {
  await dataSource.initialize();

  try {
    dataSource.transaction(async (transaction) => {
      const email = await rl.question('Email: ');
      let password = await rl.question('Password: ');
      const name = await rl.question('Name: ');
      const surname = await rl.question('Surname: ');

      password = scryptSync(
        password,
        process.env.CRYPTO_SALT as string,
        parseInt(process.env.CRYPTO_KLEN as string),
      ).toString('hex');

      const user = dataSource
        .getRepository(User)
        .create({ email, password, role: UserRole.ADMIN });
      const profile = dataSource.getRepository(Profile).create({
        name,
        surname,
        user: await transaction.save(user),
      });
      await transaction.save(profile);

      console.log('Admin Created Successfully.');
    });
  } catch (err) {
    console.error(err);
  }
}
main();
