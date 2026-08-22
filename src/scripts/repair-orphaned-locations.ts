/**
 * One-off repair for the orphaned "Alte localități" locations.
 *
 * The location category that grouped Bălți, Orhei, Ialoveni and the other
 * raion towns was hard-deleted from the admin. Both foreign keys pointing at
 * it are ON DELETE SET NULL, so the delete silently detached:
 *   - location_subcategory.categoryId  -> the towns vanished from the admin,
 *                                         which lists subcategories per category
 *   - location.locationCategoryId      -> the offert detail pages rendered a
 *                                         null category and returned HTTP 500
 *
 * This script re-attaches both to the category named below. It is idempotent
 * and writes a JSON backup of every row it touches before changing anything.
 *
 * Dry run (default):  ts-node src/scripts/repair-orphaned-locations.ts
 * Apply:              ts-node src/scripts/repair-orphaned-locations.ts --apply
 */
import { writeFileSync } from 'fs';
import { join } from 'path';
import { dataSource } from '../database/config';
import {
  Location,
  LocationCategory,
  LocationSubcategory,
} from '../database/entities';
import { IsNull } from 'typeorm';

const TARGET_CATEGORY_RO = 'Alte localități';
const APPLY = process.argv.includes('--apply');

async function main() {
  await dataSource.initialize();

  const category = await dataSource
    .getRepository(LocationCategory)
    .findOneBy({ ro: TARGET_CATEGORY_RO });

  if (!category)
    throw new Error(
      `Category "${TARGET_CATEGORY_RO}" not found — create it first.`,
    );

  console.log(`Target category: #${category.id} ${category.ro}\n`);

  const subcategories = await dataSource
    .getRepository(LocationSubcategory)
    .findBy({ category: IsNull() });

  const locations = await dataSource.getRepository(Location).find({
    where: { location_category: IsNull() },
    relations: { location_subcategory: true },
  });

  console.log(`Orphaned subcategories: ${subcategories.length}`);
  subcategories.forEach((s) => console.log(`  #${s.id} ${s.ro}`));

  console.log(`\nOrphaned locations: ${locations.length}`);
  locations.forEach((l) =>
    console.log(
      `  ${l.id} ${l.street_ro} (subcategory: ${
        l.location_subcategory?.ro ?? 'none'
      })`,
    ),
  );

  if (!subcategories.length && !locations.length) {
    console.log('\nNothing to repair.');
    return;
  }

  if (!APPLY) {
    console.log('\nDRY RUN — nothing written. Re-run with --apply to repair.');
    return;
  }

  const backup = join(
    __dirname,
    '..',
    '..',
    'backups',
    `orphaned-locations-${new Date().toISOString().replace(/[:.]/g, '-')}.json`,
  );
  writeFileSync(
    backup,
    JSON.stringify(
      {
        target_category_id: category.id,
        subcategory_ids: subcategories.map((s) => s.id),
        location_ids: locations.map((l) => l.id),
      },
      null,
      2,
    ),
  );
  console.log(`\nBackup of affected ids written to ${backup}`);

  await dataSource.transaction(async (manager) => {
    if (subcategories.length)
      await manager.getRepository(LocationSubcategory).update(
        subcategories.map((s) => s.id),
        { category: { id: category.id } },
      );

    if (locations.length)
      await manager.getRepository(Location).update(
        locations.map((l) => l.id),
        { location_category: { id: category.id } },
      );
  });

  console.log(
    `Repaired ${subcategories.length} subcategory(ies) and ${locations.length} location(s).`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (dataSource.isInitialized) await dataSource.destroy();
  });
