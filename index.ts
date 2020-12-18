import { MarketNews } from "./MarketNews";
import { AlpacaAPI } from "./AlpacaAPI";
import { Analyzer } from "./Analyzer";
import { Algorithm } from "./Algorithm";

const API_ID = "PK3NECF8YE18BPZS7A7H";
const API_KEY = "zpr5ooE4XWduXqmWNSRsgK9D9vRqVhT5fugxrs5u";
const watchlist = ["TSLA"];

const trade = async () => {
  const api = new AlpacaAPI(API_KEY, API_ID);
  const algorithm = new Algorithm(api);
  const marketNews = new MarketNews(api);

  await api.connect();
  await algorithm.loadData();
  algorithm.registerSocket(algorithm.tradeOn3InARow);
  marketNews.listen(watchlist);

  //   const news = await marketNews.getLatest(watchlist);
  //   Analyzer.showReport(news["TSLA"]);
};

trade();
