// redis-list.js
const redis = require('redis');
const client = redis.createClient({ url: 'redis://localhost:6379' });

async function main() {
  await client.connect();
  console.log('[Redis] Connected\n');

  // CREATE
  await client.rPush('urls', 'https://gov.uk/article-1');
  await client.rPush('urls', 'https://gov.uk/article-2');
  await client.rPush('urls', 'https://gov.uk/article-3');
  console.log('[Redis] Created → urls list');

  // READ
  const urls = await client.lRange('urls', 0, -1);
  console.log('[Redis] Read → urls:', urls);

  // UPDATE
  await client.lSet('urls', 0, 'https://gov.uk/updated-article-1');
  const updatedUrls = await client.lRange('urls', 0, -1);
  console.log('[Redis] Updated → urls:', updatedUrls);

  // DELETE
  await client.del('urls');
  console.log('[Redis] Deleted → urls list');

  await client.disconnect();
}

main().catch(console.error);