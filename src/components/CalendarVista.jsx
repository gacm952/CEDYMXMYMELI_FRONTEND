import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { isWeekend, setDefaultOptions, addDays, startOfToday, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const CalendarVista = ({ value, onChange, isDayClosed }) => {
  setDefaultOptions({ locale: es });

  const handleDateChange = (newValue) => {
    if (isDayClosed) {
      return;
    }
    onChange(newValue);
  };

  const shouldDisableDate = (date) => {
    // Deshabilitar fines de semana
    if (isWeekend(date)) {
      return true;
    }

    // Solo mostrar las fechas hasta los siguientes 3 meses desde el día actual
    const today = startOfToday();
    const threeMonthsLater = addMonths(today, 3);

    if (date > threeMonthsLater) {
      return true;
    }

    // Deshabilitar el día si ya ha sido cerrado
    if (isDayClosed) {
      return true;
    }

    return false;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={es}>
        
      <DatePicker 
        value={value}
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
        disablePast
        className='w-40'
      />
    </LocalizationProvider>
  );
};

export default CalendarVista;