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

  let interval:any = undefined;
  const videoRef:React.RefObject<any> = React.createRef();

  const videoStatusCheckPeriodically = () => {
    const videoElement:HTMLVideoElement = videoRef.current;

    interval = setInterval(() => {
      const { currentTime, duration } = videoElement;
      console.log(getPercentageOfVideoAlreadyPlayed(currentTime, duration));
    }, 150);
  }

  const videoStatusCheckPeriodicallyStop = () => {
    clearInterval(interval);
  }

  const handlePlay = () => {     
    videoStatusCheckPeriodically();
  };

  const handlePause = () => {
    videoStatusCheckPeriodicallyStop();
    if(interval) clearInterval(interval);
  };

  const handleEnded = () => {     
    videoStatusCheckPeriodicallyStop();
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
    currentVidRef.currentTime = 0;
  }

  useEffect(() => {
    const currentVideoRef:HTMLVideoElement = videoRef.current;

    currentVideoRef.addEventListener('play', handlePlay, true);
    currentVideoRef.addEventListener('pause', handlePause, true);
    currentVideoRef.addEventListener('ended', handleEnded, true);

    return () => {
      currentVideoRef.removeEventListener('play', handlePlay, true);
      currentVideoRef.removeEventListener('pause', handlePause, true);
      currentVideoRef.removeEventListener('ended', handleEnded, true);

      if(interval) clearInterval(interval);
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
      <button onClick={() => handlePlayControl(videoRef.current)}>play</button>
      <button onClick={() => handlePauseControl(videoRef.current)}>pause</button>
      <button onClick={() => handleStopControl(videoRef.current)}>stop/reset</button>
    </div>
  )
}
