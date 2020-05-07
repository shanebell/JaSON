import database from "./database";
import HistoryItem from "./types/HistoryItem";

const historyService = {
  save: (historyItem: HistoryItem, callback: () => void) => {
    database.history.add(historyItem).then(callback);
  },

  delete: (historyItem: HistoryItem, callback: () => void) => {
    database.history.delete(historyItem.id).then(callback);
  },

  clear: (callback: () => void) => {
    database.history.clear().then(callback);
  },

  trim: (size: number, callback: () => void) => {
    database.history.count(async (count) => {
      if (count > size) {
        const keysToDelete = await database.history.orderBy("date").reverse().offset(size).primaryKeys();
        await database.history.bulkDelete(keysToDelete);
        callback();
      }
    });
  },

  search: (searchTerm: string, limit: number, callback: (results: HistoryItem[]) => void) => {
    // TODO remove logging
    console.log('search term: "%s"', searchTerm);
    if (searchTerm.length > 0) {
      database.history
        .filter((historyItem) => {
          return historyItem.searchableText.includes(searchTerm);
        })
        .limit(limit)
        .reverse()
        .sortBy("date", callback);
    } else {
      database.history.orderBy("date").reverse().limit(limit).toArray(callback);
    }
  },
};

export default historyService;
