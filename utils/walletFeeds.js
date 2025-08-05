import Hypercore from 'hypercore';
import Corestore from 'corestore';

const store = new Corestore('./feeds');
await store.ready();

const openedFeeds = new Map();

/**
 * Get or create a feed for a specific wallet.
 */
export async function getWalletFeed(wallet) {
  if (openedFeeds.has(wallet)) return openedFeeds.get(wallet);

  const feed = store.get({ name: `wallet-${wallet}` });
  await feed.ready();

  openedFeeds.set(wallet, feed);
  return feed;
}

export function getStore() {
  return store;
}

export function getOpenedFeeds() {
  return Array.from(openedFeeds.entries());
}
