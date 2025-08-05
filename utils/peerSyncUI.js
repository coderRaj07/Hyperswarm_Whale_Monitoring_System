import blessed from 'blessed';
import { getOpenedFeeds } from './walletFeeds.js';

export function monitorPeers() {
  const screen = blessed.screen({ smartCSR: true });
  const box = blessed.box({
    top: 'center', left: 'center',
    width: '80%', height: '80%',
    label: 'Feed Sync Status',
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } },
    content: 'Loading...'
  });

  screen.append(box);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
  screen.render();

  async function updateUI() {
    const openedFeeds = getOpenedFeeds();

    let output = `👥 Opened Feeds (${openedFeeds.length}):\n`;

    for (const [wallet, feed] of openedFeeds) {
      await feed.ready();

      output += `\n💼 Wallet: ${wallet}\n`;
      output += `    Feed Length: ${feed.length}\n`;
    }

    box.setContent(output || "No active feeds yet.");
    screen.render();
  }

  setInterval(updateUI, 4000);
}