import { AlpacaAPI } from "./AlpacaAPI";

export class Trader {
   api: AlpacaAPI;

   constructor(api: AlpacaAPI) {
     this.api = api;
   }

   trade = async() => {
      this.api.send()
   }
}