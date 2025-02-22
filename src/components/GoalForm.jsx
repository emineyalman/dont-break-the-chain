import React, { useState } from 'react';

function GoalForm({ onSubmit, onClose }) {
  const [text, setText] = useState('');
  const [color, setColor] = useState('#FF1493');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newGoal = {
      text: text.trim(),
      color,
      startDate,
      circles: new Array(31).fill(false),
      id: Date.now()
    };
    
    onSubmit(newGoal);
    setText('');
    setColor('#FF1493');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="goal-form-modal" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="goal-form">
          <h2>Yeni Hedef Ekle</h2>
          
          <div className="form-group">
            <label htmlFor="text">Hedef Adı:</label>
            <input
              type="text"
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Hedef adını girin"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Renk:</label>
            <input
              type="color"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="color-picker"
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Başlangıç Tarihi:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              İptal
            </button>
            <button type="submit" className="submit-button">
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalForm; 