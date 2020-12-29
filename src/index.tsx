import React, { useEffect } from 'react'
import styles from './styles.module.css'

interface Props {
  title?: string,
  videos?: Array<string>,    // List of urls to videos  
  width?: number,     
  height?: number,    
  controls?: boolean, 
}

export const ExampleComponent = ({ 
  title = 'Web Video Player with custom contols 😄',
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
  };

  const handleEnded = () => {     
    videoStatusCheckPeriodicallyStop();
  };

  const getPercentageOfVideoAlreadyPlayed = (current:number, duration:number) => {
    return Math.round(current * 100 / duration);
  };

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
    <div className={styles.test}>
      <h5>{title}</h5>
      <video 
        className={styles.wvcVideo}
        onClick={() => { videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause() }}
        ref={videoRef}
        width={`${width}%`}
        height={`${height}%`}
        controls={controls}
        loop={false}
        muted
      >
        <source src="https://www.odt.net/static/media/Skills-teaser.e85b7707.webm" type="video/webm" />
        <source src="https://www.odt.net/static/media/Skills-teaser.e85b7707.mp4" type="video/mp4" />
        This browser does not support the HTML5 video element.
      </video>
      <button onClick={() => { videoRef.current.play() }}>play</button>
      <button onClick={() => { videoRef.current.pause() }}>pause</button>
    </div>
  )
}
