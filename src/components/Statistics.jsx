import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Statistics({ goals }) {
  const totalGoals = goals.length;
  const completedDays = goals.reduce((total, goal) => {
    return total + goal.circles.filter(circle => circle).length;
  }, 0);
  
  const successRate = totalGoals ? ((completedDays / (totalGoals * 31)) * 100).toFixed(1) : 0;
  
  const goalStats = goals.map(goal => {
    const completed = goal.circles.filter(circle => circle).length;
    const percentage = ((completed / 31) * 100).toFixed(1);
    return {
      name: goal.text,
      completed,
      percentage,
      color: goal.color
    };
  });

  const chartData = {
    labels: goals.map(goal => goal.text),
    datasets: [
      {
        label: 'Tamamlanma Yüzdesi',
        data: goalStats.map(stat => stat.percentage),
        borderColor: '#FF1493',
        backgroundColor: 'rgba(255, 20, 147, 0.2)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="statistics-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="stats-header" variants={itemVariants}>
        <h2>Hedef İstatistikleri</h2>
        <p className="stats-subtitle">Aylık performans analizi</p>
      </motion.div>

      <div className="stats-summary">
        {[
          { icon: '🎯', title: 'Toplam Hedef', value: totalGoals },
          { icon: '✅', title: 'Tamamlanan Günler', value: completedDays },
          { icon: '📊', title: 'Başarı Oranı', value: `%${successRate}` }
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.title}</h3>
              <motion.p 
                className="stat-number"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div className="stats-details" variants={itemVariants}>
        <h3>Hedef Bazlı İlerleme</h3>
        <div className="goals-progress">
          {goalStats.map((stat, index) => (
            <motion.div
              key={index}
              className="goal-progress-item"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="goal-progress-header">
                <span className="goal-name">{stat.name}</span>
                <span className="goal-percentage">%{stat.percentage}</span>
              </div>
              <div className="progress-bar-container">
                <motion.div 
                  className="progress-bar"
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  style={{ backgroundColor: stat.color || '#FF1493' }}
                >
                  <div className="progress-glow" style={{ backgroundColor: stat.color || '#FF1493' }} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="chart-section" 
        variants={itemVariants}
      >
        <h3>Aylık Trend Analizi</h3>
        <div className="chart-container">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Statistics; 