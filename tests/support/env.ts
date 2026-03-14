import dotenv from 'dotenv';

dotenv.config({ override: true, quiet: true });

function getRequiredEnv(name: 'BASE_URL' | 'USERNAME' | 'PASSWORD'): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Set it in .env or your CI secrets.`);
  }

  return value;
}

export const testEnv = {
  baseUrl: getRequiredEnv('BASE_URL'),
  username: getRequiredEnv('USERNAME'),
  password: getRequiredEnv('PASSWORD')
};
