const redis = require('redis');

const client = redis.createClient({ url: 'redis://localhost:6379' });

client.on('error', (err) => console.error('[Redis] Error:', err.message));

async function main() {
  await client.connect();
  console.log('[Redis] Connected\n');

  // create
  await client.set('name', 'Lekha');
  console.log('[Redis] Created → name: Lekha');
  // read
  const name=await client.get('name');
 console.log('[Redis] Read → name:', name);
 // update
 await client.set('name', 'Lekha DH');
  const updatedName = await client.get('name');
  console.log('[Redis] Updated → name:', updatedName);
// delete
}
main().catch(console.error);