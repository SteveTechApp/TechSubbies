
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  highlightedDates?: string[];
  onDateClick?: (date: string) => void;
  readOnly?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({ highlightedDates = [], onDateClick, readOnly = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const toISODateString = (date: Date) => {
      return date.toISOString().split('T')[0];
  };
  
  const today = new Date();
  const todayString = toISODateString(today);

  const changeMonth = (offset: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };

  const renderHeader = () => {
    const monthYearFormat = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
    return (
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {monthYearFormat.format(currentDate)}
        </h2>
        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Next month">
          <ChevronRight size={20} />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 font-medium">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-start-${i}`} className="p-1"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const cellDateString = toISODateString(cellDate);
      
      const isToday = cellDateString === todayString;
      const isHighlighted = highlightedDates.includes(cellDateString);
      const isClickable = !readOnly;

      let cellClasses = 'p-1 h-12 flex items-center justify-center text-sm rounded-full transition-colors duration-200';
      
      if (isClickable) {
          cellClasses += ' cursor-pointer';
          if (isHighlighted) {
              cellClasses += ' bg-green-500 text-white hover:bg-green-600';
          } else {
              cellClasses += ' hover:bg-gray-200';
          }
      } else {
          if (isHighlighted) {
              cellClasses += ' bg-green-200 text-green-800';
          }
      }
      
      if(isToday) {
          cellClasses += ' ring-2 ring-blue-500';
      }

      cells.push(
        <div 
          key={day} 
          className={cellClasses}
          onClick={() => isClickable && onDateClick?.(cellDateString)}
          role={isClickable ? 'button' : undefined}
          aria-pressed={isClickable ? isHighlighted : undefined}
          aria-label={isClickable ? `Toggle availability for ${cellDate.toLocaleDateString()}` : undefined}
        >
          {day}
        </div>
      );
    }
    
    return <div className="grid grid-cols-7 gap-1 mt-2">{cells}</div>;
  };


  return (
    <div className="w-full">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
      <div className="flex items-center space-x-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center"><span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>Available</div>
        <div className="flex items-center"><span className="h-3 w-3 rounded-full ring-2 ring-blue-500 mr-2"></span>Today</div>
      </div>
    </div>
  );
};
