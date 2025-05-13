import { dataSource } from '../database/';
import { faker } from '@faker-js/faker';
import { scryptSync } from 'node:crypto';
import { Profile, User, UserRole } from '../database/entities';

interface IUser {
  name: string;
  surname: string;
  email: string;
  password: string;
}

function generatePassword(length = 10): string {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function generateUsers(count: number): IUser[] {
  const users: IUser[] = [];

  for (let i = 0; i < count; i++) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const email = `${name.toLowerCase()}.${surname.toLowerCase()}@example.com`;
    const password = generatePassword();

    users.push({ name, surname, email, password });
  }

  return users;
}

function randomFromArray(arr: (UserRole.ADMIN | UserRole.USER)[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await dataSource.initialize();

  generateUsers(1000).map(({ email, password, name, surname }) => {
    try {
      dataSource.transaction(async (transaction) => {
        password = scryptSync(
          password,
          process.env.CRYPTO_SALT as string,
          parseInt(process.env.CRYPTO_KLEN as string),
        ).toString('hex');
        const user = dataSource.getRepository(User).create({
          email,
          password,
          role: randomFromArray([UserRole.ADMIN, UserRole.USER]),
        });
        const profile = dataSource.getRepository(Profile).create({
          name,
          surname,
          user: await transaction.save(user),
        });
        await transaction.save(profile);
        console.log(`Success: ${{ email, password, name, surname }}`);
      });
    } catch (err) {
      console.error(err);
    }
  });
}

main();
