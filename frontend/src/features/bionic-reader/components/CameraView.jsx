import React, { useState } from 'react';
import { Camera } from 'lucide-react';

const CameraView = ({ onImageCapture }) => {
    const [preview, setPreview] = useState(null);

    const handleCapture = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageCapture(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100">
            {!preview ? (
                <div className="flex flex-col items-center gap-8 max-w-2xl">
                    {/* Big Friendly Title */}
                    <h1 className="text-6xl font-bold text-center bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent mb-4" style={{ fontFamily: "'Fredoka', 'Comic Neue', cursive" }}>
                        📸 Snap a Picture!
                    </h1>
                    <p className="text-orange-700 text-2xl font-semibold text-center mb-6" style={{ fontFamily: "'Comic Neue', cursive" }}>
                        Take a photo of any text and I'll help you read it! ✨
                    </p>

                    <div className="bg-gradient-to-br from-orange-300 to-amber-400 p-12 rounded-full border-4 border-orange-500 hover:scale-105 transition-transform shadow-2xl">
                        <label htmlFor="camera-input" className="cursor-pointer block">
                            <Camera size={80} className="text-white drop-shadow-lg" />
                        </label>
                    </div>

                    <p className="text-orange-600 text-xl font-medium animate-bounce mt-4" style={{ fontFamily: "'Comic Neue', cursive" }}>
                        👆 Tap the camera to get started!
                    </p>

                    <input
                        id="camera-input"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleCapture}
                    />
                </div>
            ) : (
                <div className="relative w-full h-full flex flex-col items-center">
                    {/* Image Preview */}
                    <img
                        src={preview}
                        alt="Captured"
                        className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-2xl mb-6 border-4 border-orange-300"
                    />

                    <button
                        onClick={() => setPreview(null)}
                        className="bg-gradient-to-r from-orange-400 to-amber-400 hover:from-orange-500 hover:to-amber-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl active:scale-95 transition-all duration-200 border-2 border-orange-600"
                        style={{ fontFamily: "'Comic Neue', cursive" }}
                    >
                        📷 Retake Photo
                    </button>
                </div>
            )}
        </div>
    );
};

export default CameraView;
