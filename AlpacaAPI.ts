import httpClient, { AxiosRequestConfig } from "axios";
import { TradingPlatformAPI } from "./TradingPlatformAPI";
import { client as WebSocketClient } from "websocket";
import { Logger } from "./Logger";
import { TradeItem } from "./Types";

const URL = "https://paper-api.alpaca.markets";

export class AlpacaAPI extends TradingPlatformAPI {
  constructor(apiKey: string, apiId: string) {
    super(apiKey, apiId);
  }

  send = async (
    url: string,
    method: "GET" | "POST",
    more?: { data?: any; headers?: any }
  ) => {
    const headers = more?.headers ?? {};

    const requestConfig: AxiosRequestConfig = {
      url: `${URL}${url}`,
      headers: {
        "APCA-API-KEY-ID": this.apiId,
        "APCA-API-SECRET-KEY": this.apiKey,
        "content-type": "application/json",
        ...headers,
      },
      method,
    };
    if (more?.data) {
      requestConfig.data = more.data;
    }

    const request = await httpClient(requestConfig);
    return request;
  };

  socketSetup() {
    const client = new WebSocketClient();

    client.on("connectFailed", (error) => {
      console.log("Connect Error: " + error.toString());
    });

    client.on("connect", (connection) => {
      console.log("WebSocket Client Connected");
      connection.on("error", (error) => {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", () => {
        console.log("echo-protocol Connection Closed");
      });
      connection.on("message", (message) => {});

      this.connection = connection;
    });

    return client;
  }

  connect = async () => {
    this.client = this.socketSetup();
    this.client.connect("wss://data.alpaca.markets/stream");

    await new Promise((res, rej) => {
      if (this.client) {
        this.client.on("connect", () => {
          res();
        });
      }
    });

    if (!this.connection) {
      Logger.logRed("Websocket not yet connected!");
    }

    // Auth
    const authEvent = {
      action: "authenticate",
      data: {
        key_id: this.apiId,
        secret_key: this.apiKey,
        debug: true,
      },
    };

    console.log(authEvent);

    this.socketSend(authEvent);
  };

  socketSend(event: { action: string; data?: any }) {
    if (this.client) {
      this.connection.send(JSON.stringify(event));
    }
  }

  buy(symbol: string, amountInDollars: number) {
    if (!symbol) {
      return;
    }
    this.send("/v2/orders", "POST", {
      data: {
        symbol,
        type: "market",
        side: "buy",
        qty: 10,
        limit_price: null,
        stop_price: null,
        time_in_force: "day",
      },
    });
  }

  sell(symbol: string, amountInDollars: number) {
    if (!symbol) {
      return;
    }
    this.send("/v2/orders", "POST", {
      data: {
        symbol,
        type: "market",
        side: "sell",
        qty: 10,
        limit_price: null,
        stop_price: null,
        time_in_force: "day",
      },
    });
  }

  getShares = async (symbol: string) => {
    try {
      const res = await this.send(`/v2/positions/${symbol}`, "GET");

      return res.data.qty;
    } catch (e) {
      return 0;
    }
  };

  transformTradeItem(message: any) {
    if (message.type === "utf8" && message.utf8Data) {
      const data = JSON.parse(message.utf8Data);

      const tradeItem = {
        symbol: data.data.T,
        price: data.data.p,
        timestamp: data.data.t,
      };

      return tradeItem;
    }
  }
}
