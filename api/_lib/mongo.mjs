// MongoDB-tilkobling med connection caching for serverless.
// I serverless må vi gjenbruke MongoClient mellom kall — ellers lekker connections.

import { MongoClient } from 'mongodb';

let cachedClient = null;
let cachedPromise = null;

async function getClient(uri) {
  if (cachedClient) return cachedClient;
  if (!cachedPromise) {
    cachedPromise = MongoClient.connect(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    }).then((client) => {
      cachedClient = client;
      return client;
    }).catch((err) => {
      cachedPromise = null;
      throw err;
    });
  }
  return cachedPromise;
}

export async function saveContact(config, document) {
  const client = await getClient(config.uri);
  const col = client.db(config.db).collection(config.collection);
  const result = await col.insertOne(document);
  return result.insertedId;
}
