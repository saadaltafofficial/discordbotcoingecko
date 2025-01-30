const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const { trendingSearchList } = require("./authApi");
const express = require("express");
const TelegramBot = require("node-telegram-bot-api");
const app = express();

const PORT = 3000;
const Token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(Token, { polling: false });

app.use(express.json());

// DISCORD BOT

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  message.reply({
    content: "Hello",
  });
});

client.on("interactionCreate", async (interaction) =>
  interaction.reply((await setMessage()).toString())
);
client.login(process.env.COINGECKO_BOT_TOKEN);

async function setMessage() {
  const message = await trendingSearches();
  let result = "";
  for (let i = 0; i < message.length; i++) {
    let msg = message[i];
    result += `**coinName**: ${
      msg.coinName
    }, **coinPrice**: ${msg.coinPrice.toFixed(2)}, **coinPriceChange24h**: ${
      msg.coinPriceChange24h
    }, **coinMarketCap**:${msg.coinMarketCap}\n`;
  }

  return result;
}

async function trendingSearches() {
  const trendingCoins = [];
  const response = await trendingSearchList();
  const data = response.data.coins;

  data.map((item) =>
    trendingCoins.push({
      coinName: item.item.name,
      coinSymbol: item.item.symbol,
      coinPrice: item.item.data.price,
      coinPriceChange24h: item.item.data.price_change_percentage_24h.usd,
      coinMarketCap: item.item.data.market_cap,
      coinTotalVolume: item.item.data.total_volume,
      coinMarketCapRank: item.item.market_cap_rank,
      coinUrl: item.item.data.sparkline,
      coinContent: item.item.data.content,
    })
  );

  return trendingCoins;
}

// Webhook endpoint
app.post('/bot-endpoint', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Telegram message handler
bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, 'Received your message!');
  } catch (error) {
    console.error('Telegram error:', error);
  }
});

// Initialize webhook after server starts
const initializeWebhook = async () => {
  try {
    const webhookUrl = `${process.env.MY_NGROK_URL}/bot-endpoint`;
    await bot.setWebHook(webhookUrl);
    console.log(`Webhook set to: ${webhookUrl}`);
  } catch (error) {
    console.error('Webhook initialization failed:', error);
  }
};

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeWebhook();
});
