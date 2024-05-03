let cache = {
	lastFetchDate: null,
	data: null,
};

async function test() {
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
	const currentMonth = today.getMonth(); // Get current month (0-11)
	const currentYear = today.getFullYear(); // Get current year

	// Calculate the first day of the next month
	const firstDayNextMonth = new Date(currentYear, currentMonth + 1, 1);

	// Calculate the last day of the next month
	const lastDayNextMonth = new Date(currentYear, currentMonth + 2, 0); // 0th day of month is last day of previous month

	const dates = [];
	for (
		let day = firstDayNextMonth;
		day <= lastDayNextMonth;
		day.setDate(day.getDate() + 1)
	) {
		dates.push({ date: day.toISOString().split('T')[0] }); // Format the date as 'YYYY-MM-DD'
	}

	return dates;
}

async function initializeAndProcess() {
	let arr1 = await test();
	let arr2 = getDatesForNextMonth();
	console.log('Holidays:', arr1);
	console.log('Dates for next month:', arr2);

	getAndRemove(arr1, arr2);
}

function getAndRemove(arr1, arr2) {
	const datesFromArray1 = new Set(arr1.map((item) => item.date));
	const filteredArray2 = arr2.filter((item) => !datesFromArray1.has(item.date));
	console.log('Filtered dates (excluding holidays):', filteredArray2);
	return filteredArray2;
}

initializeAndProcess();
