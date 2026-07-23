// redis-hash.js
const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

async function main() {
  await client.connect();
  console.log('[Redis] Connected\n');

  // CREATE
  await client.hSet('user:1', {
    name:  'Lekha',
    email: 'lekha@example.com',
    age:   '25'
  });
  console.log('[Redis] Created → user:1 hash');

  // READ
  const user = await client.hGetAll('user:1');
  console.log('[Redis] Read → user:1:', user);

  // UPDATE
  await client.hSet('user:1', 'age', '22');
  const updatedUser = await client.hGetAll('user:1');
  console.log('[Redis] Updated → user:1:', updatedUser);

 // DELETE
  await client.del('user:1');
  console.log('[Redis] Deleted → user:1 hash');

  await client.disconnect();
}

main().catch(console.error);