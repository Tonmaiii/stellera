const now = Date.now;

export const overrideTime = (callback: (now: number) => number) => {
	Date.now = new Proxy(Date.now, { apply: () => callback(now()) });
};
