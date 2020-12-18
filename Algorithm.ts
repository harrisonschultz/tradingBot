import { TradingPlatformAPI } from "./TradingPlatformAPI";
import { TradeItem } from "./Types";
import chalk from "chalk";

export class Algorithm {
  api: TradingPlatformAPI;
  trades: Array<TradeItem>;
  shares: number;

  constructor(api: TradingPlatformAPI) {
    this.api = api;
    this.trades = Array<TradeItem>();
    this.shares = 0;
  }

  loadData = async () => {
    this.shares = await this.api.getShares("TSLA");
  };

  registerSocket(algorithm: (item: TradeItem) => void) {
    if (this.api.connection) {
      this.api.connection.on("message", (message: any) => {
        const item = this.api.transformTradeItem(message);
        if (item) {
          algorithm(item);
        }
      });
    } else {
      console.error("NOT YET CONNECTED");
    }
  }

  tradeOn3InARow = async (item: TradeItem) => {
    // Keep 4 trades in the array.
    if (this.trades.length < 4) {
      this.trades.push(item);
      return;
    } else {
      this.trades.shift();
      this.trades.push(item);
    }

    // If over the last 3 trades the price went up
    let riseCount = 0;
    let fallCount = 0;
    let lastTrade;
    for (var t of this.trades) {
      if (lastTrade && lastTrade.price < t.price) {
        riseCount++;
      } else if (lastTrade && lastTrade.price > t.price) {
        fallCount++;
      }
      lastTrade = t;
    }

    console.log(`
    Rise: ${riseCount}
    Fall: ${fallCount}
    Prices: ${this.trades.map((t) => t.price).join(", ")}
    Shares: ${this.shares}
    `);

    if (riseCount > 2 && this.shares < 10) {
      console.log(
        chalk.green(
          `Buying ${this.trades[0].symbol} at ${
            this.trades[this.trades.length - 1].price
          }`
        )
      );
      this.api.buy(this.trades[0].symbol, 5000);
      this.shares += 10;
    } else if (fallCount > 1 && this.shares > 0) {
      console.log(
        chalk.red(
          `Selling ${this.trades[0].symbol} at ${
            this.trades[this.trades.length - 1].price
          }`
        )
      );
      this.api.sell(this.trades[0].symbol, 5000);
      this.shares -= 10;
    }
  };
}
