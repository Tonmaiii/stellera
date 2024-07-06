export const getJson = <T>(key: string, defaultData: T) => {
	const dataJson = localStorage.getItem(key);
	let data = defaultData;
	if (dataJson) {
		try {
			data = JSON.parse(dataJson);
		} catch {
			data = defaultData;
		}
	}
	return data;
};

export const setJson = <T>(key: string, data: T) => {
	localStorage.setItem(key, JSON.stringify(data));
};

export const updateJson = <T>(key: string, defaultData: T, callback: (data: T) => T) => {
	const data = getJson(key, defaultData);
	const updated = callback(data);
	setJson(key, updated);
};
