const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config()
const { trendingSearchList } = require('./authApi');

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
