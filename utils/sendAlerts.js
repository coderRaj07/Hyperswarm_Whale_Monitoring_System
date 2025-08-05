import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export async function sendTelegramAlert(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    });
  } catch (err) {
    console.error('Telegram error:', err.message);
  }
}

export async function sendDiscordAlert(message) {
  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: message
    });
  } catch (err) {
    console.error('Discord error:', err.message);
  }
}