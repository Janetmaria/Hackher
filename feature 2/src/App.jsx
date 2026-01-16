import { useState } from 'react'
import BalloonGame from './components/BalloonGame'
import StoryMode from './components/StoryTelling/StoryMode'
import FeatureSelection from './components/FeatureSelection'

function App() {
    const [selectedFeature, setSelectedFeature] = useState(null);

    const handleSelectFeature = (feature) => {
        setSelectedFeature(feature);
    };

    const handleBackToSelection = () => {
        setSelectedFeature(null);
    };

    // Show feature selection screen if no feature is selected
    if (!selectedFeature) {
        return <FeatureSelection onSelectFeature={handleSelectFeature} />;
    }

    // Show selected feature with back button
    return (
        <div className="app-container">
            <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
                <button
                    className="btn"
                    onClick={handleBackToSelection}
                    style={{
                        background: 'linear-gradient(135deg, var(--primary) 0%, #e0f2fe 100%)',
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem'
                    }}
                >
                    ← Back to Features
                </button>
            </div>

            {selectedFeature === 'balloon' ? (
                <div>
                    <h1>Let's Read It Out Louddd!</h1>
                    <div style={{ marginTop: '2rem' }}>
                        <BalloonGame />
                    </div>
                </div>
            ) : (
                <StoryMode />
            )}
        </div>
    )
}

export default App
