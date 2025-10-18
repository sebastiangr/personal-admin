import { beforeAll } from 'vitest';
import { execSync } from 'child_process';

beforeAll(() => {
  console.log('--- Limpiando la base de datos de pruebas UNA SOLA VEZ ---');
  execSync('npx prisma migrate reset --force --skip-seed');
}, 60000);