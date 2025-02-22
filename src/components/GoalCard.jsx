import React from 'react';

function GoalCard({ goal, onDelete, toggleCircle, currentDay }) {
  // Ay isimleri
  const months = [
    "OCAK", "ŞUBAT", "MART", "NİSAN", "MAYIS", "HAZİRAN",
    "TEMMUZ", "AĞUSTOS", "EYLÜL", "EKİM", "KASIM", "ARALIK"
  ];

  // Şu anki ay ve gün
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = months[currentMonth];
  
  // Ayın ilk gününü al
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentMonth, 1);
  const startingDay = firstDayOfMonth.getDay();
  // Pazar 0 olduğu için Pazartesi 1 olacak şekilde ayarla
  const adjustedStartingDay = startingDay === 0 ? 6 : startingDay - 1;

  // Ayın toplam gün sayısı
  const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

  // Takvim grid'ini oluştur
  const calendarDays = [];
  // Boş günleri ekle
  for (let i = 0; i < adjustedStartingDay; i++) {
    calendarDays.push(null);
  }
  // Ayın günlerini ekle
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // Doğru gün için tıklama işleyicisi
  const handleDayClick = (day) => {
    if (day) {
      const adjustedIndex = day + adjustedStartingDay - 1;
      toggleCircle(goal.id, adjustedIndex); // Düzeltilmiş indeksi gönderiyoruz
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
              <div>Pt</div>
              <div>Sa</div>
              <div>Ça</div>
              <div>Pe</div>
              <div>Cu</div>
              <div>Ct</div>
              <div>Pa</div>
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