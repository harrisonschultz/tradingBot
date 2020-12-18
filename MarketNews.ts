import { AlpacaAPI } from "./AlpacaAPI";
import Moment from "moment";

export class MarketNews {
  api: AlpacaAPI;

  constructor(api: AlpacaAPI) {
    this.api = api;
  }

  getLatest = async (tickers: Array<string>) => {
    const url = this.api.createQueryString(`https://data.alpaca.markets/v1/bars/minute`, {
      symbols: tickers.join(","),
    });


    const req = await this.api.send(url, "GET");

    return req.data
  };

  listen = async (tickers: Array<string>) => {
     const event = {
        action: 'listen',
        data: {
           streams: tickers.map( t => `T.${t}`)
        }
     }

     this.api.socketSend(event)
 };
}
