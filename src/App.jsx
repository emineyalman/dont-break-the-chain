import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Statistics from './components/Statistics'
import GoalCard from './components/GoalCard'
import GoalForm from './components/GoalForm'

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

  const addGoal = (newGoal) => {
    setGoals(prevGoals => [...prevGoals, newGoal]);
    setShowForm(false);
  };

  const toggleCircle = (goalId, circleIndex) => {
    setGoals(prevGoals => prevGoals.map(goal => {
      if (goal.id === goalId) {
        const newCircles = [...goal.circles];
        newCircles[circleIndex] = !newCircles[circleIndex];
        return { ...goal, circles: newCircles };
      }
      return goal;
    }));
  };

  const deleteGoal = (goalId) => {
    if (confirm('Bu hedefi silmek istediğinizden emin misiniz?')) {
      setGoals(goals.filter(goal => goal.id !== goalId))
    }
  }

  return (
    <Router>
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
              className="floating-add-button"
              onClick={() => setShowForm(true)}
            >
              +
            </button>
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
            <Link to="/" className="menu-item" onClick={() => setMenuOpen(false)}>Hedefler</Link>
            <Link to="/statistics" className="menu-item" onClick={() => setMenuOpen(false)}>İstatistikler</Link>
          </div>
        </div>

        <div className="modern-container">
          <Routes>
            <Route path="/" element={
              <>
                <div className="goals-grid">
                  {goals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onDelete={deleteGoal}
                      toggleCircle={toggleCircle}
                      currentDay={currentDay}
                    />
                  ))}
                </div>
                {showForm && (
                  <GoalForm
                    onSubmit={addGoal}
                    onClose={() => setShowForm(false)}
                  />
                )}
              </>
            } />
            <Route path="/statistics" element={<Statistics goals={goals} />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
