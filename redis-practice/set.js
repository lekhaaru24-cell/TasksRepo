const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

async function main() {
  await client.connect();
  console.log('[Redis] Connected\n');

  // CREATE
   await client.sAdd('fruits', 'apple');
  await client.sAdd('fruits', 'banana');
  await client.sAdd('fruits', 'mango');
  await client.sAdd('fruits','grapes');
  console.log('[Redis] Created → fruits set');

  // READ
  const fruits = await client.sMembers('fruits');
  console.log('[Redis] Read → fruits:', fruits);
   
  // CHECK if member exists
  const exists = await client.sIsMember('fruits', 'apple');
  console.log('[Redis] apple exists:', exists); 

// DELETE one member
 await client.sRem('fruits', 'banana');
  const updatedFruits = await client.sMembers('fruits');
  console.log('[Redis] Removed banana → fruits:', updatedFruits);

// DELETE entire set
  await client.del('fruits');
  console.log('[Redis] Deleted → fruits set');

  await client.disconnect();
}
main().catch(console.error);