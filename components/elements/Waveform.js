import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

const Waveform = ({
  audioUrl,
  waveColor,
  progressColor,
  size,
  filename,
  IsReal,
  forHome,
  onPlay,
  audioId,
  handleDelete
}) => {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Destroy previous WaveSurfer instance if it exists
    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
    }

    // Initialize WaveSurfer
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: waveColor || '#ffffff',
      progressColor: progressColor || '#ADFF2F',
      url: audioUrl,
      dragToSeek: true,
      height: size.height || 80,
      barHeight: size.barHeight || 20,
      barRadius: size.barRadius || 5,
      barWidth: size.barWidth || 3,
      hideScrollbar: true,
      normalize: true,
      responsive: true,
      partialRender: true, // For performance
    });

    // Cleanup on component unmount
    return () => wavesurferRef.current.destroy();
  }, [audioUrl, waveColor, progressColor, size]);

  const togglePlayPause = () => {
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
        setIsPlaying(false);
      } else {
        wavesurferRef.current.play();
        setIsPlaying(true);
        if (onPlay) onPlay(audioId); // Notify parent which audio is being played
      }
    }
  };

  return (
    <div className='waveform-main'>
      <button
        onClick={togglePlayPause}
        data-id={audioId}
        style={{ display: 'flex', alignItems: 'center', marginTop: '10px', border: 'none', background: 'none' }}
      >
        <img
          src={isPlaying ? (IsReal ? "/assets/img/voice/RealPauseIcon.png" : "/assets/img/voice/FakePauseIcon.png") : (IsReal ? "/assets/img/voice/RealPlayIcon.png" : "/assets/img/voice/FakePlayIcon.png")}
          alt={isPlaying ? "Pause" : "Play"}
          style={{ width: '50px', height: 'auto' }}
        />
      </button>
      <div style={{ width: forHome ? '100%' : '80%', height: size.height || '80px' }}>
        {!forHome && <p>{filename}</p>} {/* Show filename if not forHome */}
        <div ref={waveformRef}></div> {/* Waveform container */}
      </div>
      <div
        style={{ display: forHome ? 'none' : 'flex', alignItems: 'center', marginTop: '10px', border: 'none', background: 'none' }}
      >
        <img
          src={forHome ? "" : "/assets/img/voice/reportIcon.png"}
          style={{ width: '30px', height: 'auto', margin: '10px' }}
        />
        <span className={IsReal ? "realspan" : "fakespan"}>{!forHome ? (IsReal ? "Real" : "Fake") : ""}</span>
        <img
          src={forHome ? "" : "/assets/img/voice/deleteicon.png"}
          alt="Delete"
          onClick={() => handleDelete(audioId)} // Handle delete action
          style={{ width: '30px', height: 'auto', margin: '10px', cursor: 'pointer' }}
        />
      </div>
    </div>
  );
};

export default Waveform;
