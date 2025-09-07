import { Profile } from '../database/entities';
import { dataSource } from '../database';

// Define the users and their job functions
const usersData = [
  {
    surname: 'Nafornița',
    name: 'Maria',
    job_function: 'Broker ipotecar | Ипотечный брокер | Mortgage Broker',
  },
  {
    surname: 'David',
    name: 'Igor',
    job_function:
      'Broker imobiliar | Брокер по недвижимости | Real Estate Broker',
  },
  {
    surname: 'Straista',
    name: 'Elena',
    job_function:
      'Broker imobiliar | Брокер по недвижимости | Real Estate Broker',
  },
  {
    surname: 'Pîrnai',
    name: 'Irina',
    job_function:
      'Broker imobiliar | Брокер по недвижимости | Real Estate Broker',
  },
  {
    surname: 'Dimcea',
    name: 'Veaceslav',
    job_function:
      'CEO fondator | Генеральный директор – основатель | Founder & CEO',
  },
];

async function main() {
  console.log('Connecting to database...');
  await dataSource.initialize();

  try {
    await dataSource.transaction(async (transaction) => {
      const profileRepository = transaction.getRepository(Profile);

      console.log('Starting job function population...\n');

      for (const userData of usersData) {
        try {
          // Find profile by name and surname
          const profile = await profileRepository.findOne({
            where: {
              name: userData.name,
              surname: userData.surname,
            },
          });

          if (profile) {
            // Update the job_function
            profile.job_function = userData.job_function;
            await transaction.save(profile);

            console.log(
              `✅ Updated job function for ${userData.name} ${userData.surname}`,
            );
            console.log(`   Job: ${userData.job_function}\n`);
          } else {
            console.log(
              `⚠️  Profile not found for ${userData.name} ${userData.surname}`,
            );
            console.log(
              `   Please check if the user exists or if the name/surname is correct.\n`,
            );
          }
        } catch (error) {
          console.error(
            `❌ Error updating ${userData.name} ${userData.surname}:`,
            error.message,
          );
        }
      }

      console.log('Job function population completed!');
    });
  } catch (err) {
    console.error('Transaction failed:', err);
  } finally {
    await dataSource.destroy();
    process.exit(0);
  }
}

// Run the script
main().catch((error) => {
  console.error('Script failed:', error);
  process.exit(1);
});
