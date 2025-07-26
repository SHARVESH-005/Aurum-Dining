import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const DateTimeSelection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("reservation-date", selectedDate.toISOString());
    navigate("/reserve-table");
  };

  return (
    <div className="mt-20 text-center">
      <h2 className="text-2xl font-bold mb-4 text-amber-800">Select Date and Time</h2>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        dateFormat="MMMM d, yyyy h:mm aa"
        className="border px-4 py-2 rounded"
      />
      <div className="mt-6">
        <button
          onClick={handleNext}
          className="bg-amber-600 text-white px-6 py-2 rounded hover:bg-amber-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateTimeSelection;
