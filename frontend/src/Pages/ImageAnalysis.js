import React, { useRef } from 'react';

const ImageAnalysis = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageData, setImageData] = React.useState(null);

    const accessCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error("Error accessing the camera:", err);
        }
    };

    const captureAndDownloadPhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            const context = canvas.getContext('2d');

            // Set canvas size to match video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert canvas to a data URL and save it for downloading
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImageData(dataUrl);

            // Trigger a download
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = 'captured_image.jpg';
            link.click();
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
                onClick={() => window.open('http://localhost:8501', '_blank')}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px',
                }}
            >
                ImageAnalysis
            </button>

            <div>
                <button
                    onClick={accessCamera}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        margin: '10px',
                    }}
                >
                    Access Camera
                </button>
                <button
                    onClick={captureAndDownloadPhoto}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        backgroundColor: '#28A745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Capture & Download
                </button>
            </div>

            {/* Video and Canvas Elements */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <video ref={videoRef} style={{ border: '1px solid #ddd', maxWidth: '100%' }} />
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            </div>
        </div>
    );
};

export default ImageAnalysis;
