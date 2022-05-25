// Librarys
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Utils
import { isWindowAvailable } from "@utils/Validations";

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage = isWindowAvailable() ? createWebStorage('local') : createNoopStorage();

export default storage;
