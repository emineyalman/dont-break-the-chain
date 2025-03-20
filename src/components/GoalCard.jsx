import React from 'react';

function GoalCard({ goal, onDelete, toggleCircle, currentDay }) {
  // Month names
  const months = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  // Current month and day
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth];
  
  // Get first day of month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
  const startingDay = firstDayOfMonth.getDay();
  // Adjust so Monday is 1 (Sunday is 0)
  const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

  // Total days in month
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

  // Create calendar grid
  const calendarDays = [];
  // Add empty days
  for (let i = 0; i < adjustedStartingDay; i++) {
    calendarDays.push(null);
  }
  // Add month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Click handler for correct day
  const handleDayClick = (day) => {
    if (day) {
      const adjustedIndex = day + adjustedStartingDay - 1;
      toggleCircle(goal.id, adjustedIndex); // Send adjusted index
    }
  };

  return (
    <div className="goal-card" style={{ borderColor: goal.color }}>
      <div className="goal-header">
        <div className="goal-info">
          <h3>{goal.text}</h3>
          <span className="goal-date">{goal.startDate}</span>
        </div>
        <button 
          className="delete-button" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(goal.id);
          }}
        >×</button>
      </div>
      <div className="chain-container">
        <div className="month-section">
          <div className="month-name">{currentMonthName}</div>
          <div className="calendar-grid">
            <div className="weekdays">
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
              <div>Su</div>
            </div>
            <div className="days-grid">
              {calendarDays.map((day, index) => (
                <div 
                  key={index} 
                  className={`calendar-cell ${day === currentDay ? 'current-day' : ''}`}
                >
                  {day && (
                    <>
                      <span className="date-number">{day}</span>
                      <div
                        className={`circle ${goal.circles[day + adjustedStartingDay - 1] ? 'completed' : ''} ${
                          day === currentDay ? 'current' : ''
                        }`}
                        style={{
                          borderColor: goal.color,
                          backgroundColor: goal.circles[day + adjustedStartingDay - 1] ? goal.color : 'transparent'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDayClick(day);
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoalCard;