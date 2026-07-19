import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { seedCatalog } from './catalog-seeder';

const run = async () => {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl)
    throw new Error('DATABASE_URL is required to seed the catalog');

  const pool = new Pool({ connectionString: databaseUrl });
  try {
    const result = await seedCatalog(drizzle(pool));
    const summary = `${result.rooms} rooms, ${result.bundles} bundles, ${result.items} items, ${result.slots} slots`;
    if (result.status === 'already-current') {
      console.log(
        `Catalog is already current (${summary}, checksum ${result.checksum}).`,
      );
    } else {
      console.log(
        `Catalog seed completed (${summary}, checksum ${result.checksum}).`,
      );
    }
  } finally {
    await pool.end();
  }
};

run().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Catalog seed failed: ${message}`);
  process.exitCode = 1;
});
