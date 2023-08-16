import { useState, useEffect, useContext  } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DigitalClock } from '@mui/x-date-pickers/DigitalClock';
import { isWeekend, setDefaultOptions, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import BookingContext from '../context/BookingProvider';
import fc from 'festivos-colombia';
import useAuth from '../hooks/useAuth';

function Calendar({ onDateChange, onTimeChange, doctorMatchSchedule, doctorMatchDates }) {

  setDefaultOptions({ locale: es })

  console.log(doctorMatchDates, doctorMatchSchedule)

  const [value, setValue] = useState(new Date())
  const [selectedTimes, setSelectedTimes] = useState([]);
  const { dateFromBackend } = useContext(BookingContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const { auth } = useAuth()

  const isUser = auth.role === "User"

  const getColombiaHolidays = (year) => {
    return fc.getHolidaysByYear(year)
      .filter((holiday) => holiday.static)
      .map((holiday) => new Date(holiday.date));
  };

  const splitDatesAndTimes = doctorMatchDates.map(date => {
    const dateTime = new Date(date);
    const formattedDate = dateTime.toLocaleDateString('es-CO');
    const formattedTime = dateTime.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    return { date: formattedDate, time: formattedTime };
  });

  useEffect(() => {
    if (dateFromBackend) {
      const disabledTimes = {};
      dateFromBackend.forEach((booking) => {
        const dateKey = booking.toDateString(); // Obtener una clave única para cada fecha
        if (!disabledTimes[dateKey]) {
          disabledTimes[dateKey] = [];
        }
        disabledTimes[dateKey].push(booking);
      });
      setSelectedTimes(disabledTimes);
    }
  }, [dateFromBackend]);

  const handleDateChange = (newValue) => {
    setValue(newValue);
    onDateChange(newValue);
  };

  const handleTimeChange = (newValue) => {
    setValue(newValue);
    onTimeChange(newValue);
  };

  const disableNonCurrentYears = (date) => {
    const currentYear = new Date().getFullYear();
    const selectedYear = date.getFullYear();
    return selectedYear !== currentYear;
  };

  const disableAfterThreeMonths = (date) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
  
    return date.getMonth() - currentMonth > 2;
  };

  const shouldDisableTime = (selectedTime) => {
    const [startTime, endTime] = doctorMatchSchedule.split(' ');
    const minHour = parseInt(startTime);
    const maxHour = parseInt(endTime) + 12;
    const restStartHour = 12;
    const restEndHour = 14;
  
    const selectedHour = selectedTime.getHours();
    const selectedMinutes = selectedTime.getMinutes();
    const selectedDateTime = new Date(value);
    selectedDateTime.setHours(selectedHour);
    selectedDateTime.setMinutes(selectedMinutes);
  
    const isTimeBooked = doctorMatchDates.filter(date => {
      const dateTime = new Date(date);
      return dateTime.getTime() === selectedDateTime.getTime();
    }).length;
  
    return (
      selectedHour < minHour ||
      selectedHour > maxHour ||
      (selectedHour === minHour && selectedMinutes < 0) ||
      (selectedHour === maxHour && selectedMinutes > 0) ||
      (selectedHour >= restStartHour && selectedHour < restEndHour) ||
      isTimeBooked >= 2
    );
  };

  const shouldDisableDate = (date) => {

    // Obtener una clave única para cada fecha
      const dateKey = date.toDateString(); 
      const disabledTimesForDate = selectedTimes[dateKey];
   
    // Verificar si todas las citas están seleccionadas para el día
     
     const isAllTimesSelected = disabledTimesForDate && disabledTimesForDate.length === 81;
  
    // Verificar si la fecha es un día feriado en Colombia
      const colombiaHolidays = getColombiaHolidays(date.getFullYear());
      const isHoliday = colombiaHolidays.some((holiday) => holiday.toDateString() === date.toDateString());
   
      const isDisabled =
        isWeekend(date) ||
        isAllTimesSelected ||
        isHoliday ||
        (isUser && date <= addDays(new Date(), 1));
      
     return isDisabled;
   };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        <div className='grid grid-cols-1 sm:grid-cols-2 '>
          <DateCalendar 
          orientation="landscape"
          disablePast="true" 
          shouldDisableMonth={disableAfterThreeMonths}
          shouldDisableYear={disableNonCurrentYears}
          shouldDisableDate={shouldDisableDate}
          value={selectedDate || undefined}     
          onChange={handleDateChange} 
          />
          <div className='my-auto'>
            <DigitalClock 
              skipDisabled
              orientation="landscape"
              timeStep={20}
              shouldDisableTime={shouldDisableTime}
              value={value}
              onChange={handleTimeChange}
            />
          </div>
      </div>
      </LocalizationProvider>
  )
}

export default Calendar