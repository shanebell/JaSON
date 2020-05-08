import Dexie from "dexie";
import HistoryItem from "./types/HistoryItem";

export class JasonDatabase extends Dexie {
  history: Dexie.Table<HistoryItem, string>;
  constructor() {
    super("JaSON");
    this.version(1).stores({
      history: "id, url, method, contentType, host, date, favourite",
    });
    this.history = this.table("history");
  }
}

const database = new JasonDatabase();

export default database;
