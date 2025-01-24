const axios = require('axios')
require('dotenv').config()

const api =  axios.create({
    baseURL: `https://api.coingecko.com/api/v3`
})

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    "x-cg-demo-api-key": process.env.COINGECKO_API,
  },
};

const trendingSearchList = async () => {
  return await api.get("/search/trending", options);
};


const coinsMarketData = async () => {
  return await api.get("/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Csolana%2Czignaly%2Ccelestia%2Cthe-open-network%2Cripple%2Ctether%2Cdogecoin%2Csui%2Cavalanche-2%2Cpolkadot&locale=en", options)
}

module.exports = {
  trendingSearchList,
  coinsMarketData
}