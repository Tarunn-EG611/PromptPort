import React from 'react';
import { useSelector } from 'react-redux';

const StatCards = () => {
  const { templates } = useSelector((state) => state.templates);
  const { collections } = useSelector((state) => state.collections);

  const stats = [
    {
      label: 'Public Prompts',
      value: templates?.length || 0,
      icon: '✨',
      iconBg: 'rgba(99, 102, 241, 0.15)',
      iconColor: '#6366f1',
    },
    {
      label: 'My Collections',
      value: collections?.length || 0,
      icon: '📁',
      iconBg: 'rgba(16, 185, 129, 0.15)',
      iconColor: '#10b981',
    },
    {
      label: 'Active Categories',
      value: 5,
      icon: '🏷️',
      iconBg: 'rgba(245, 158, 11, 0.15)',
      iconColor: '#f59e0b',
    },
  ];

  return (
    <div className="stat-cards-container">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-content">
            <span className="stat-label">{stat.label}</span>
            <span className="stat-value">{stat.value}</span>
          </div>
          <div
            className="stat-icon-wrapper"
            style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}
          >
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;