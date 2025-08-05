import Hyperswarm from 'hyperswarm';
import crypto from 'crypto';
import { getStore } from './utils/walletFeeds.js';
import { startWhaleWatcher } from './walletWatcher.js';
import { monitorPeers } from './utils/peerSyncUI.js';

const store = getStore();
await store.ready();

// Start Hyperswarm
const swarm = new Hyperswarm();
const topic = crypto.createHash('sha256').update('usdt-whale-alerts').digest();
swarm.join(topic, { lookup: true, announce: true });

swarm.on('connection', (socket) => {
  console.log('🔗 Peer connected!');
  store.replicate(socket);
});

await startWhaleWatcher();
monitorPeers(store);