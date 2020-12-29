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
  const canvasRef:React.RefObject<any> = React.createRef();

  const videoStatusCheckPeriodically = () => {
    const videoElement:HTMLVideoElement = videoRef.current;

    interval = setInterval(() => {
      const { currentTime, duration } = videoElement;
      const currentPercentage = getPercentageOfVideoAlreadyPlayed(currentTime, duration);
      
      draw(currentPercentage);
    }, 50);
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
    currentVidRef.pause();
    currentVidRef.currentTime = 0;
    resetCanvas();
  }

  const draw = (percentage:number) => {
    const canvas = canvasRef.current;
    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const widthByPercentage = width * percentage / 100;
      const height = canvas.height;

      ctx.fillStyle = "rgb(200,0,0)";
      ctx.fillRect(0, 0, widthByPercentage, height);
    } 
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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
      <canvas ref={canvasRef} id="wcv-progress-bar" className={styles.wvcProgressBar}></canvas>
      <button onClick={() => handlePlayControl(videoRef.current)}>play</button>
      <button onClick={() => handlePauseControl(videoRef.current)}>pause</button>
      <button onClick={() => handleStopControl(videoRef.current)}>stop/reset</button>
    </div>
  )
}
