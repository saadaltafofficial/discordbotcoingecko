const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const { trendingSearchList } = require('./authApi');
const express = require('express')
const TelegramBot = require('node-telegram-bot-api');
const app = express()

const PORT = 3000
const Token = process.env.TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(Token, { polling: false });

app.use(express.json())

// DISCORD BOT

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.on('messageCreate', async (message) => {
    if(message.author.bot) return
    message.reply({
        content: "Hello"
    })
})

client.on('interactionCreate', async interaction => interaction.reply((await setMessage()).toString()))
client.login(process.env.COINGECKO_BOT_TOKEN)

async function setMessage() {
    const message = await trendingSearches()
    let result = ""
    for(let i=0; i < message.length; i++){
        let msg = message[i]
        result += `**coinName**: ${msg.coinName}, **coinPrice**: ${msg.coinPrice.toFixed(2)}, **coinPriceChange24h**: ${msg.coinPriceChange24h}, **coinMarketCap**:${msg.coinMarketCap}\n`
    }
    
    return result
    
}

async function trendingSearches() {
    const trendingCoins = []
    const response = await trendingSearchList()
    const data = response.data.coins

    data.map(item => trendingCoins.push({
        coinName: item.item.name,
        coinSymbol: item.item.symbol,
        coinPrice: item.item.data.price,
        coinPriceChange24h: item.item.data.price_change_percentage_24h.usd,
        coinMarketCap: item.item.data.market_cap,
        coinTotalVolume: item.item.data.total_volume,
        coinMarketCapRank: item.item.market_cap_rank,
        coinUrl: item.item.data.sparkline,
        coinContent: item.item.data.content
    }))
    
    return trendingCoins 
}

// TELEGRAM BOT
// Set webhook route
app.post('/bot-endpoint', (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
  
  // Handle messages
  bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Hi!');
  });
  
  // Set webhook on startup
  bot.setWebHook(`${process.env.MY_NGROK_URL}/bot-endpoint`)
    .then(() => console.log('Webhook set successfully'))
    .catch(console.error);
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
