import React from 'react';
import { useSelector } from 'react-redux';

const StatCards = () => {
  const { templates } = useSelector((state) => state.templates);
  const { collections } = useSelector((state) => state.collections);

  const stats = [
    {
      label: 'Public Prompts',
      value: templates.length || 0,
      color: '#2563eb',
    },
    {
      label: 'My Collections',
      value: collections.length || 0,
      color: '#10b981',
    },
    {
      label: 'Categories',
      value: 5,
      color: '#f59e0b',
    },
  ];

  return (
    <div className="stat-cards-container">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="stat-card"
          style={{ borderLeft: `4px solid ${stat.color}` }}
        >
          <span className="stat-label">{stat.label}</span>
          <span className="stat-value">{stat.value}</span>
        </div>
      ))}
    </div>
  );
};

export default StatCards;