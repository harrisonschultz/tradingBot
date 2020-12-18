import { Logger } from "./Logger";

export class Analyzer {
  static showReport = (data: Array<{ t: number; o: number; c: number }>) => {
    let down = 0;
    let up = 0;
    for (var d of data) {
      if (d.o >= d.c) {
        down += Math.abs(d.o - d.c);
        Logger.logRed(`${d.o} -> ${d.c}`);
      } else {
        up += Math.abs(d.o - d.c);
        Logger.logGreen(`${d.o} -> ${d.c}`);
      }
    }
    console.log(`Up ${up}`);
    console.log(`Down ${down}`);
  };
}
