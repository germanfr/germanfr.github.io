import { CacheManagerBase } from './CacheManagerBase';

export class BrowserCacheManager extends CacheManagerBase {
	#storage;

	constructor(maxAge, storage = window.localStorage) {
		super(maxAge);
		this.#storage = storage;
	}

	// Override
	hasData(key) {
		return !this.hasExpired(key) && this.#readSafe(key) != null;
	}

	// Get data without checking if it has expired
	getDataAsIs(key) {
		let payload = this.#readSafe(key);
		if (!payload) return null;

		try {
			return JSON.parse(payload);
		} catch (e) {
			console.error('MemoryCacheManager.getDataAsIs:', e);
			return null;
		}
	}

	saveData(key, data) {
		let payload = JSON.stringify(data);

		this.#writeSafe(this.#getTimestampKey(key), Date.now());
		this.#writeSafe(key, payload);
	}

	removeData(key) {
		try {
			this.#storage.removeItem(key);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToDeleteNotified) {
				console.warn('Unable to remove data from browser\'s Storage API');
			}
			this._unableToDeleteNotified = true;
		}
	}

	getTimestamp(key) {
		return this.#readSafe(this.#getTimestampKey(key));
	}


	#readSafe(key) {
		try {
			return this.#storage.getItem(key);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToGetNotified) {
				console.warn('Unable to get data from browser\'s Storage API');
			}
			this._unableToGetNotified = true;

			return null;
		}
	}

	#writeSafe(key, value) {
		try {
			this.#storage.setItem(key, value);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToSetNotified) {
				console.warn('Unable to save data to browser\'s Storage API');
			}
			this._unableToSetNotified = true;

			return null;
		}
	}

	#getTimestampKey(key) {
		return key + '-timestamp';
	}
}
