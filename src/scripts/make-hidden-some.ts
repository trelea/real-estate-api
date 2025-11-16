import { User } from '../database/entities';
import { dataSource } from '../database/config';

async function makeUsersHidden() {
  try {
    await dataSource.initialize();
    console.log('Database connection established');

    const userRepository = dataSource.getRepository(User);

    const emailsToHide = ['admin@admin.com', 'trelea@trelea.com'];

    const result = await userRepository
      .createQueryBuilder()
      .update(User)
      .set({ hidden: true })
      .where('email IN (:...emails)', { emails: emailsToHide })
      .execute();

    console.log(`Updated ${result.affected} user(s) to hidden`);

    const hiddenUsers = await userRepository.find({
      where: emailsToHide.map((email) => ({ email })),
      select: ['id', 'email', 'hidden'],
    });

    console.log('Hidden users:');
    hiddenUsers.forEach((user) => {
      console.log(`- ${user.email}: hidden = ${user.hidden}`);
    });

    await dataSource.destroy();
    console.log('Script completed successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

makeUsersHidden();
