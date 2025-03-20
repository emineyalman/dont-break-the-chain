import React from 'react';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
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
import './Statistics.css'

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

  const combinedChartData = {
    labels: Array.from({length: 31}, (_, i) => i + 1),
    datasets: goals.map(goal => ({
      label: goal.text,
      data: goal.circles.map(circle => circle ? 1 : 0),
      borderColor: goal.color,
      backgroundColor: `${goal.color}33`,
      fill: true,
      tension: 0.4
    }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12
          },
          boxWidth: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 12 },
        bodyFont: { size: 11 }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.1)'
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="statistics-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
          padding: '1rem'
        }}
      >
        <motion.div 
          className="stats-header" 
          variants={itemVariants}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <h2>Goal Statistics</h2>
          <p className="stats-subtitle">Monthly Performance Analysis</p>
        </motion.div>

        <div className="stats-summary" style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          {[
            { icon: '🎯', title: 'Total Goals', value: totalGoals, color: '#6366f1' },
            { icon: '✅', title: 'Completed Days', value: completedDays, color: '#22c55e' },
            { icon: '📊', title: 'Overall Success Rate', value: `${successRate}%`, color: '#f97316' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              style={{
                flex: '1 1 250px',
                maxWidth: '350px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}05)`,
                border: `2px solid ${stat.color}30`,
                borderRadius: '12px'
              }}
            >
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}>
                <h3>{stat.title}</h3>
                <p className="stat-value" style={{color: stat.color}}>{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={itemVariants}
          className="chart-section"
          style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: '16px',
            height: '400px'
          }}
        >
          <h3 style={{marginBottom: '1rem'}}>All Goals Comparison</h3>
          <Line data={combinedChartData} options={chartOptions} />
        </motion.div>

        <div className="individual-stats" style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center'
        }}>
          {goals.map((goal) => {
            const completed = goal.circles.filter(circle => circle).length;
            const percentage = ((completed / 31) * 100).toFixed(1);
            
            const individualChartData = {
              labels: Array.from({length: 31}, (_, i) => i + 1),
              datasets: [{
                label: 'Daily Progress',
                data: goal.circles.map(circle => circle ? 1 : 0),
                borderColor: goal.color,
                backgroundColor: `${goal.color}33`,
                fill: true,
                tension: 0.4
              }]
            };

            return (
              <motion.div 
                key={goal.id}
                variants={itemVariants}
                style={{
                  flex: '1 1 300px',
                  maxWidth: '450px',
                  background: 'var(--card-bg)',
                  padding: '1.5rem',
                  borderRadius: '16px',
                  border: `2px solid ${goal.color}30`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}
              >
                <h3 style={{color: goal.color}}>{goal.text}</h3>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}>
                  <div className="metric">
                    <span>Completed</span>
                    <h4 style={{color: goal.color}}>{completed}</h4>
                  </div>
                  <div className="metric">
                    <span>Success</span>
                    <h4 style={{color: goal.color}}>{percentage}%</h4>
                  </div>
                  <div className="metric">
                    <span>Remaining</span>
                    <h4 style={{color: goal.color}}>{31 - completed}</h4>
                  </div>
                </div>

                <div style={{height: '200px'}}>
                  <Line data={individualChartData} options={{...chartOptions, plugins: {...chartOptions.plugins, legend: {display: false}}}} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Statistics;