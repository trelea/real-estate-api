import { User } from '../database/entities';
import { scryptSync } from 'node:crypto';
import { dataSource } from '../database';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: npm run admin:update-password <email> <password>');
    process.exit(1);
  }

  await dataSource.initialize();

  try {
    const userRepository = dataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      console.error(`User with email "${email}" not found.`);
      process.exit(1);
    }

    const encryptedPassword = scryptSync(
      password,
      process.env.CRYPTO_SALT as string,
      parseInt(process.env.CRYPTO_KLEN as string),
    ).toString('hex');

    await userRepository.update({ id: user.id }, { password: encryptedPassword });

    console.log(`Password updated successfully for user: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating password:', err);
    process.exit(1);
  }
}

main();
