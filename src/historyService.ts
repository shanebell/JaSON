import database from "./database";
import HistoryItem from "./types/HistoryItem";
import { Collection, Table } from "dexie";
import _ from "lodash";
import { legacyRequestToHistoryItem } from "./historyUtil";
import { HistoryFilter } from "./types/HistoryFilter";

const { history } = database;

export const HISTORY_SEARCH_LIMIT = 100;

const LEGACY_HISTORY_KEY = "JaSON.history";
const MAX_HISTORY_SIZE = 1000;

const isEmpty = (historyFilter: HistoryFilter): boolean => {
  return historyFilter.searchTerm.length === 0 && !historyFilter.showFavourites;
};

const applyOrderBy = (database: Table<HistoryItem, string>): Collection<HistoryItem, string> => {
  return database.orderBy("date").reverse();
};

const applyLimit = (collection: Collection<HistoryItem, string>): Collection<HistoryItem, string> => {
  return collection.limit(HISTORY_SEARCH_LIMIT);
};

const applyShowFavourites = (
  collection: Collection<HistoryItem, string>,
  showFavourites: boolean
): Collection<HistoryItem, string> => {
  return showFavourites ? collection.filter((historyItem: HistoryItem) => historyItem.favourite === 1) : collection;
};

const applySearchTerm = (
  collection: Collection<HistoryItem, string>,
  searchTerm: string
): Collection<HistoryItem, string> => {
  if (searchTerm.length > 0) {
    const parts = searchTerm.trim().toLowerCase().split(/\s+/);
    const terms = _.compact(_.uniq(parts));

    // filter by search term
    if (terms.length > 0) {
      collection = collection.filter((historyItem: HistoryItem) => {
        return _.every(terms, (term) => {
          return historyItem.searchableText.includes(term);
        });
      });
    }
  }
  return collection;
};

const historyService = {
  save: (historyItem: HistoryItem, callback: () => void) => {
    history.add(historyItem).then(callback);
  },

  delete: (historyItem: HistoryItem, callback: () => void) => {
    history.delete(historyItem.id).then(callback);
  },

  update: (historyItem: HistoryItem, updates: {}, callback: () => void) => {
    history.update(historyItem.id, updates).then(callback);
  },

  clear: (includeFavourites: boolean, callback: () => void) => {
    if (includeFavourites) {
      history.clear().then(callback);
    } else {
      history.where({ favourite: 0 }).delete().then(callback);
    }
  },

  trim: (callback: () => void) => {
    history.count(async (count) => {
      // include a buffer of 50 records so we don't trim history every time
      if (count > MAX_HISTORY_SIZE + 50) {
        const keysToDelete = await history.orderBy("date").reverse().offset(MAX_HISTORY_SIZE).primaryKeys();
        await history.bulkDelete(keysToDelete);
        callback();
      }
    });
  },

  search: (historyFilter: HistoryFilter, callback: (results: HistoryItem[]) => void) => {
    const { searchTerm, showFavourites } = historyFilter;
    let collection = applyOrderBy(history);
    if (!isEmpty(historyFilter)) {
      collection = applyShowFavourites(collection, showFavourites);
      collection = applySearchTerm(collection, searchTerm);
    }
    collection = applyLimit(collection);
    collection.toArray().then(callback);
  },

  migrate: (callback: () => void) => {
    const historyString = localStorage.getItem(LEGACY_HISTORY_KEY);
    if (historyString) {
      console.debug("Attempting to migrate legacy JaSON history");
      const start = Date.now();
      const itemsToSave: HistoryItem[] = [];
      try {
        const historyItems: any[] = JSON.parse(historyString);
        _.forEach(historyItems, (historyItem) => {
          if (itemsToSave.length >= MAX_HISTORY_SIZE) {
            return false;
          }
          const item = legacyRequestToHistoryItem(historyItem);
          if (item) {
            itemsToSave.push(item);
          }
        });
      } catch (e) {
        console.debug("Error migrating history: %s", e.message);
      } finally {
        history.bulkAdd(itemsToSave).then(() => callback());
        console.debug("History migration took %sms", Date.now() - start);
        localStorage.removeItem(LEGACY_HISTORY_KEY);
      }
    }
  },
};

export default historyService;
