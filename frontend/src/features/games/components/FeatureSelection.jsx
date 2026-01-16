import React from 'react';

const FeatureSelection = ({ onSelectFeature }) => {
  return (
    <div className="feature-selection-container">
      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '2rem', color: '#1e3a8a' }}>Choose Your Adventure! 🎉</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '3rem' }}>
          Pick a fun activity to start playing!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
          <button
            className="btn feature-card"
            onClick={() => onSelectFeature('balloon')}
            style={{
              background: 'linear-gradient(135deg, #C5D89D 0%, #B5C88D 100%)',
              color: '#1e3a8a',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              minHeight: '300px'
            }}
          >
            <div style={{ fontSize: '5rem' }}>🎈</div>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Balloon Game</h2>
            <p style={{ fontSize: '1rem', margin: 0, opacity: 0.9 }}>
              Let's Read It Out Louddd!
            </p>
          </button>

          <button
            className="btn feature-card"
            onClick={() => onSelectFeature('story')}
            style={{
              background: 'linear-gradient(135deg, #EDEDCE 0%, #EBEBC0 100%)',
              color: '#1e3a8a',
              padding: '3rem 2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              minHeight: '300px'
            }}
          >
            <div style={{ fontSize: '5rem' }}>📖</div>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>Story Weaver</h2>
            <p style={{ fontSize: '1rem', margin: 0, opacity: 0.9 }}>
              It's Story Timee 🪄
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSelection;
