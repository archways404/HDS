import React, { useState, useEffect } from 'react';

function Calendar() {
	const [dates, setDates] = useState([]); // Store all dates from the server
	const [selectedDates, setSelectedDates] = useState(new Set()); // Store selected dates
	const [currentIndex, setCurrentIndex] = useState(0); // Index for currently displayed date for time input
	const [availability, setAvailability] = useState({}); // Store time availability for selected dates
	const [step, setStep] = useState(1); // Step 1 for date selection, Step 2 for time input

	useEffect(() => {
		fetch('http://localhost:3000/fetchdays')
			.then((response) => response.json())
			.then((data) => setDates(data))
			.catch((error) => console.error('Error fetching dates:', error));
	}, []);

	const toggleDateSelection = (date) => {
		setSelectedDates((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(date)) {
				newSet.delete(date);
			} else {
				newSet.add(date);
			}
			return newSet;
		});
	};

	const handleTimeChange = (startTime, endTime) => {
		setAvailability((prev) => ({
			...prev,
			[selectedDatesArray[currentIndex]]: { startTime, endTime },
		}));
	};

	const handleNext = () => {
		if (currentIndex < selectedDatesArray.length - 1) {
			setCurrentIndex((prev) => prev + 1);
		} else {
			// Proceed to review or submission step
			console.log('All entries done:', availability);
		}
	};

	const handleContinue = () => {
		setStep(2); // Move to time specification step
	};

	const selectedDatesArray = Array.from(selectedDates); // Convert Set to Array for easier mapping

	return (
		<div className="grid grid-cols-6 gap-4 p-4">
			{step === 1 &&
				dates.map((item, index) => (
					<button
						key={index}
						className={`p-2 ${
							selectedDates.has(item.date)
								? 'bg-blue-500 text-white'
								: 'bg-gray-200'
						}`}
						onClick={() => toggleDateSelection(item.date)}>
						{item.date}
					</button>
				))}
			{step === 2 && selectedDatesArray.length > 0 && (
				<div>
					<div>{selectedDatesArray[currentIndex]}</div>
					<label>
						Between
						<input
							type="time"
							onChange={(e) =>
								handleTimeChange(
									e.target.value,
									availability[selectedDatesArray[currentIndex]]?.endTime
								)
							}
							value={
								availability[selectedDatesArray[currentIndex]]?.startTime || ''
							}
						/>
						and
						<input
							type="time"
							onChange={(e) =>
								handleTimeChange(
									availability[selectedDatesArray[currentIndex]]?.startTime,
									e.target.value
								)
							}
							value={
								availability[selectedDatesArray[currentIndex]]?.endTime || ''
							}
						/>
					</label>
					<button onClick={handleNext}>Next</button>
				</div>
			)}
			{step === 1 && <button onClick={handleContinue}>Continue</button>}
		</div>
	);
}

export default Calendar;
