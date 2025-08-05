import Corestore from 'corestore';
import Hypercore from 'hypercore';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const wallet = process.argv[2];
if (!wallet) {
  console.error("❌ Usage: node scripts/showWalletLogs.js <WALLET_ADDRESS>");
  process.exit(1);
}

// Instead of copy, open the original feed folder directly
const FEEDS_PATH = path.resolve(__dirname, '../feeds');
const store = new Corestore(FEEDS_PATH);

const feed = store.get({ name: `wallet-${wallet}` });
await feed.ready();

if (feed.length === 0) {
  console.log(`🕳️ No entries found for ${wallet}`);
  process.exit(0);
}

console.log(`📒 Log entries for wallet ${wallet} (Length: ${feed.length})`);
for (let i = 0; i < feed.length; i++) {
  const entry = await feed.get(i);
  console.log(`\n🔸 Entry #${i + 1}`);
  console.log(JSON.parse(entry.toString()));
}
