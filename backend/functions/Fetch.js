let cache = {
	lastFetchDate: null,
	data: null,
};

async function fetchHolidays() {
	const today = new Date().toISOString().split('T')[0];
	if (cache.lastFetchDate === today && cache.data !== null) {
		console.log('Returning cached data');
		return cache.data;
	}
	try {
		let response = await fetch('https://api.dagsmart.se/holidays');
		if (response.ok) {
			let parsedDays = await response.json();
			console.log('Fetched new data');
			cache = {
				lastFetchDate: today,
				data: parsedDays,
			};
			return parsedDays;
		} else {
			console.error('HTTP Error:', response.status);
			return [];
		}
	} catch (error) {
		console.error('Fetch Error:', error.message);
		return [];
	}
}

function getDatesForNextMonth() {
	const today = new Date();
	const currentMonth = today.getMonth();
	const currentYear = today.getFullYear();
	const firstDayNextMonth = new Date(currentYear, currentMonth + 1, 1);
	const lastDayNextMonth = new Date(currentYear, currentMonth + 2, 0);
	const dates = [];
	for (
		let day = firstDayNextMonth;
		day <= lastDayNextMonth;
		day.setDate(day.getDate() + 1)
	) {
		dates.push({ date: day.toISOString().split('T')[0] });
	}
	return dates;
}

async function initializeAndProcess() {
	let Holidays = await fetchHolidays();
	let DaysInTheMonth = getDatesForNextMonth();
	let newDates = getAndRemove(Holidays, DaysInTheMonth);
	return newDates;
}

function getAndRemove(arr1, arr2) {
	const datesFromArray1 = new Set(arr1.map((item) => item.date));
	const filteredArray2 = arr2.filter((item) => !datesFromArray1.has(item.date));
	return filteredArray2;
}

module.exports = {
	initializeAndProcess,
};
