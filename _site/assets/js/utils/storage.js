const DEFAULT_MAX_AGE = 1000 * 60 * 60; // 1h

export class StorageCacheManager {
	constructor(maxAge) {
		this.maxAge = parseInt(maxAge) || DEFAULT_MAX_AGE;
	}

	async get(key, opts) {
		let data = undefined;
		const isValid = typeof opts.isValid === 'function'
			? opts.isValid
			: data => data != null;

		let savedData = this.getParsedData(key);
		if (!this.hasData(key) || !isValid(savedData)) {
			try {
				data = await opts.fetch();
			} catch (e) {}

			if (isValid(data)) {
				this.saveData(key, data);
			}
		}

		if (data === undefined) { // Return cached data if nothing is received
			data = isValid(savedData) ? savedData : null;
		}

		return data;
	}

	hasData(key) {
		return !this.hasExpired(key) && this.getSafe(key) != null;
	}

	getData(key, ignoreExpiration = true) {
		if (!ignoreExpiration && this.hasExpired(key)) {
			// Entry exists but it's expired
			this.removeData(key);
			return null;
		}

		this.getParsedData(key);
	}

	getParsedData(key) {
		let payload = this.getSafe(key);
		if (!payload) return null;

		try {
			return JSON.parse(payload);
		} catch (e) {
			console.error('StorageCacheManager.getParsedData:', e);
			return null;
		}
	}

	saveData(key, data) {
		let payload = JSON.stringify(data);

		this.setSafe(this.getTimestampKey(key), Date.now());
		this.setSafe(key, payload);
	}

	removeData(key) {
		try {
			localStorage.removeItem(key);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToDeleteNotified) {
				console.warn('Unable to remove data from localStorage');
			}
			this._unableToDeleteNotified = true;
		}
	}

	hasExpired(key) {
		let timestamp = this.getSafe(this.getTimestampKey(key));
		return !timestamp || timestamp < Date.now() - this.maxAge;
	}

	getSafe(key) {
		try {
			return localStorage.getItem(key);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToGetNotified) {
				console.warn('Unable to get data from localStorage');
			}
			this._unableToGetNotified = true;

			return null;
		}
	}

	setSafe(key, value) {
		try {
			localStorage.setItem(key, value);
		} catch (e) { /* Ignore errors in private mode */
			if (!this._unableToSetNotified) {
				console.warn('Unable to save data to localStorage');
			}
			this._unableToSetNotified = true;

			return null;
		}
	}

	getTimestampKey(key) {
		return key + '-timestamp';
	}
}
