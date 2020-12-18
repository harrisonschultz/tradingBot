import chalk from "chalk";

export class Logger {
  static logRed(str: string) {
    console.log(chalk.red(str));
  }
  static logGreen(str: string) {
    console.log(chalk.green(str));
  }
}
