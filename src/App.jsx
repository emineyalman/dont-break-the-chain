import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const defaultColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
    '#D4A5A5', '#9B59B6', '#3498DB', '#E67E22', '#2ECC71'
  ]

  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals')
    return savedGoals ? JSON.parse(savedGoals) : []
  })
  
  const [newGoal, setNewGoal] = useState('')
  const [selectedColor, setSelectedColor] = useState(defaultColors[0])
  const [showForm, setShowForm] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // LocalStorage kaydetme
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.className = darkMode ? 'dark-mode' : 'light-mode'
  }, [darkMode])

  // Bugünün tarihini al
  const today = new Date()
  const currentDay = today.getDate()
  const currentMonth = today.getMonth()

  // Ayın günlerini oluştur
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(currentMonth, today.getFullYear())

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ]

  const handleAddGoal = (e) => {
    e.preventDefault()
    if (newGoal.trim()) {
      setGoals([...goals, {
        title: newGoal,
        color: selectedColor,
        circles: Array(daysInMonth).fill(false),
        id: Date.now(),
        createdAt: new Date().toLocaleDateString()
      }])
      setNewGoal('')
      setShowForm(false)
      const nextColorIndex = (defaultColors.indexOf(selectedColor) + 1) % defaultColors.length
      setSelectedColor(defaultColors[nextColorIndex])
    }
  }

  const toggleCircle = (goalId, circleIndex) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const newCircles = [...goal.circles]
        newCircles[circleIndex] = !newCircles[circleIndex]
        return { ...goal, circles: newCircles }
      }
      return goal
    }))
  }

  const deleteGoal = (goalId) => {
    if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      setGoals(goals.filter(goal => goal.id !== goalId))
    }
  }

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <nav className="top-nav">
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <h1>2025'DE ZİNCİRİ KIRMA</h1>
        </div>
        <div className="nav-right">
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className={`top-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-items">
          <a href="#" className="menu-item active">
            <span>Ana Sayfa</span>
          </a>
          <a href="#" className="menu-item">
            <span>İstatistikler</span>
          </a>
          <a href="#" className="menu-item">
            <span>Ayarlar</span>
          </a>
        </div>
      </div>

      <main className="main-content">
        <div className="modern-container">
          <h2>{monthNames[currentMonth]} Ayı Hedef Takibi</h2>

          {showForm && (
            <div className="modal-overlay">
              <div className="goal-form-modal">
                <h3>Yeni Hedef Ekle</h3>
                <form onSubmit={handleAddGoal} className="goal-form">
                  <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="Hedefini buraya yaz..."
                    className="goal-input"
                    autoFocus
                  />
                  <div className="color-picker">
                    {defaultColors.map(color => (
                      <div
                        key={color}
                        className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                  <div className="form-buttons">
                    <button type="button" className="cancel-button" onClick={() => setShowForm(false)}>
                      İptal
                    </button>
                    <button type="submit" className="add-button">
                      Ekle
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="goals-grid">
            {goals.map(goal => (
              <div key={goal.id} className="goal-card" style={{ borderColor: goal.color }}>
                <div className="goal-header">
                  <div className="goal-info">
                    <h3 style={{ color: goal.color }}>{goal.title}</h3>
                    <span className="goal-date">Başlangıç: {goal.createdAt}</span>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
                <div className="chain-container">
                  <div className="month-section">
                    <div className="month-name" style={{ color: goal.color }}>
                      {monthNames[currentMonth]}
                    </div>
                    <div className="calendar-grid">
                      <div className="weekdays">
                        <span>Pzt</span>
                        <span>Sal</span>
                        <span>Çar</span>
                        <span>Per</span>
                        <span>Cum</span>
                        <span>Cmt</span>
                        <span>Paz</span>
                      </div>
                      <div className="days-grid">
                        {Array.from({ length: new Date(2025, currentMonth + 1, 0).getDate() }, (_, i) => {
                          const day = i + 1;
                          const date = new Date(2025, currentMonth, day);
                          const dayOfWeek = date.getDay();
                          const firstDay = new Date(2025, currentMonth, 1).getDay();
                          
                          // Ay başındaki boş günler için
                          if (i === 0) {
                            const emptyDays = firstDay === 0 ? 6 : firstDay - 1;
                            const emptyCells = Array(emptyDays).fill(null);
                            return [
                              ...emptyCells.map((_, index) => (
                                <div key={`empty-${index}`} className="calendar-cell empty" />
                              )),
                              <div key={day} className={`calendar-cell ${day === currentDay ? 'current' : ''}`}>
                                <span className="date-number">{day}</span>
                                <div
                                  className={`circle ${goal.circles[i] ? 'completed' : ''} 
                                    ${day === currentDay ? 'current' : ''}`}
                                  style={{
                                    backgroundColor: goal.circles[i] ? goal.color : 'transparent',
                                    borderColor: goal.color
                                  }}
                                  onClick={() => toggleCircle(goal.id, i)}
                                />
                              </div>
                            ];
                          }
                          
                          return (
                            <div key={day} className={`calendar-cell ${day === currentDay ? 'current' : ''}`}>
                              <span className="date-number">{day}</span>
                              <div
                                className={`circle ${goal.circles[i] ? 'completed' : ''} 
                                  ${day === currentDay ? 'current' : ''}`}
                                style={{
                                  backgroundColor: goal.circles[i] ? goal.color : 'transparent',
                                  borderColor: goal.color
                                }}
                                onClick={() => toggleCircle(goal.id, i)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <button 
        className="floating-add-button"
        onClick={() => setShowForm(true)}
      >
        +
      </button>
    </div>
  )
}

export default App
