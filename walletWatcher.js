import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { sendTelegramAlert, sendDiscordAlert } from './utils/sendAlerts.js';
import { getWalletFeed } from './utils/walletFeeds.js';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_URL);
const USDT_ABI = ["event Transfer(address indexed from, address indexed to, uint256 value)"];
const usdt = new ethers.Contract(process.env.USDT_CONTRACT, USDT_ABI, provider);
const MIN_USDT = ethers.parseUnits(process.env.MIN_USDT_ALERT, 6);

export async function startWhaleWatcher() {
  console.log("🐋 Starting USDT whale watcher...");

  usdt.on("Transfer", async (from, to, value, event) => {
    if (value < MIN_USDT) return;

    const log = {
      from,
      to,
      value: value.toString(),
      txHash: event.transactionHash,
      timestamp: Date.now()
    };

    const alertMsg = `🚨 Whale Transfer\n💰 ${ethers.formatUnits(value, 6)} USDT\n🔁 From: ${from}\n📥 To: ${to}\n🔗 https://etherscan.io/tx/${event.transactionHash}`;

    // await sendTelegramAlert(alertMsg);
    // await sendDiscordAlert(alertMsg);

    const fromFeed = await getWalletFeed(from);
    const toFeed = await getWalletFeed(to);

    await fromFeed.append(JSON.stringify({ direction: 'sent', ...log }));
    await toFeed.append(JSON.stringify({ direction: 'received', ...log }));
  });
}