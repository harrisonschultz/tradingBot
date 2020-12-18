import httpClient, { AxiosResponse } from "axios";
import { client as WebSocketClient } from "websocket";
import { TradeItem } from "./Types";

export class TradingPlatformAPI {
  apiKey: string;
  apiId: string;
  client?: WebSocketClient;
  connection: any;

  constructor(apiKey: string, apiId: string) {
    this.apiId = apiId;
    this.apiKey = apiKey;
  }

  send = async (url: string, method: "GET" | "POST", headers?: any) => {
    const requestConfig = {
      url,
      headers,
      method,
    };
    const request = await httpClient(requestConfig);

    return request;
  };

  createQueryString(url: string, query: any) {
    let formatted = `${url}?`;
    for (var key in query) {
      formatted += `${key}=${query[key]}&`;
    }

    // Remove trailing ampersand
    formatted.substring(0, formatted.length - 1);
    return formatted;
  }

  transformTradeItem(message: any): TradeItem | undefined {
    return message;
  }

  getShares = async (symbol: string): Promise<number> => {
    return 0;
  };
  buy(symbol: string, amountInDollars: number) {}
  sell(symbol: string, amountInDollars: number) {}
}
