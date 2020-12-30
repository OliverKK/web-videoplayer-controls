import React, { useEffect } from 'react'
import styles from './styles.module.css'

interface VideoObject {
  src: string,
  type: string
}

interface Props {
  videos?: Array<VideoObject>,
  width?: number,     
  height?: number,    
  controls?: boolean, 
}

export const ExampleComponent = ({ 
  videos = [],
  width = 100,
  height = 100,
  controls = false
}: Props) => {

  const videoRef:React.RefObject<any> = React.createRef();
  const progressBarRef:React.RefObject<any> = React.createRef();

  const handleTimeUpdate = () => {   
    const videoElement:HTMLVideoElement = videoRef.current;  
    const { currentTime, duration } = videoElement;
    const currentPercentage = getPercentageOfVideoAlreadyPlayed(currentTime, duration);
    progressBarRef.current.style.width = `${currentPercentage}%`;      
  };

  const getPercentageOfVideoAlreadyPlayed = (current:number, duration:number) => {
    return Math.round(current * 100 / duration);
  };

  const handlePlayControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.play();
  }

  const handleTogglePlayVideoControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.paused ? currentVidRef.play() : currentVidRef.pause()
  }

  const handlePauseControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.pause();
  }

  const handleStopControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.pause();
    currentVidRef.currentTime = 0;
  }

  useEffect(() => {
    const currentVideoRef:HTMLVideoElement = videoRef.current;

    currentVideoRef.addEventListener('timeupdate', handleTimeUpdate, true);

    return () => {
      currentVideoRef.removeEventListener('timeupdate', handleTimeUpdate, true);
    }
  }, [])
  
  return (
    <div className={styles.wcvVideoWrapper}>
      <video 
        className={styles.wvcVideo}
        onClick={() => handleTogglePlayVideoControl(videoRef.current) }
        ref={videoRef}
        width={`${width}%`}
        height={`${height}%`}
        controls={controls}
        loop={false}
        muted
      >
        {
          videos.map(({ src, type }:VideoObject) => {
            return <source src={src} type={type} key={`${type}-${btoa(src)}`}/>
          })
        }
        This browser does not support the HTML5 video element.
      </video>
      <div className={styles.wvcProgressBarWrapper}>
        <div ref={progressBarRef} className={styles.wvcProgressBar} />
      </div>      
      <button onClick={() => handlePlayControl(videoRef.current)}>play</button>
      <button onClick={() => handlePauseControl(videoRef.current)}>pause</button>
      <button onClick={() => handleStopControl(videoRef.current)}>stop/reset</button>
    </div>
  )
}
