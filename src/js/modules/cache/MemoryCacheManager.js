import { CacheManagerBase } from './CacheManagerBase';

export class MemoryCacheManager extends CacheManagerBase {
	#data = {};

	// constructor(maxAge) {
	// 	this.#data = {};
	// 	super(maxAge);
	// }

	// Get data without checking if it has expired
	getDataUnsafe(key) {
		return this.#data[key]?.data;
	}

	saveData(key, data) {
		this.#data[key] = {
			data,
			timestamp: Date.now(),
		};
	}

	removeData(key) {
		delete this.#data[key];
	}

	getTimestamp(key) {
		return this.#data[key]?.timestamp;
	}
}
