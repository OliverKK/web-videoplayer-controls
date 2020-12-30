import React, { useEffect } from 'react'
import styles from './styles.module.css'

interface VideoObject {
  src: string,
  type: string
}

interface Props {
  videos?: Array<VideoObject>,
  width?: string,     
  height?: string,    
  controls?: boolean, 
}

export const ExampleComponent = ({ 
  videos = [],
  width = '100%',
  height = '100%',
  controls = false 
}: Props) => {

  let active = false;
  let currentX = 0;

  const videoRef:React.RefObject<any> = React.createRef();
  const progressBarWrapperRef:React.RefObject<any> = React.createRef();
  const progressBarRef:React.RefObject<any> = React.createRef();
  const progressBarDotRef:React.RefObject<any> = React.createRef();

  const getPercentageOfPlayedVideo = () => {
    const videoElement:HTMLVideoElement = videoRef.current;  
    const { currentTime, duration } = videoElement;
    const currentPercentage = Math.round(currentTime * 100 / duration);

    return currentPercentage;
  }

  const getPercentageOfPlayedVideoByCurrentPosition = (currentPosition:number) => {
    const totalWidth = progressBarWrapperRef.current.clientWidth;
    const calculatedPercentage = currentPosition * (100 / totalWidth);

    return calculatedPercentage;
  }

  const paintProgressBar = (currentPercentage:number) => {
    const progressBar:HTMLDivElement = progressBarRef.current;
    const totalWidth = progressBarWrapperRef.current.clientWidth;
    const calculatedWidth = currentPercentage * (totalWidth / 100);
    progressBar.style.borderLeft = `${calculatedWidth}px solid red`;
  }

  const moveProgressBarDot = (currentPercentage:number) => {
    const totalWidth = progressBarWrapperRef.current.clientWidth;
    const calculatedWidth = currentPercentage * (totalWidth / 100);

    setTranslate(calculatedWidth, progressBarDotRef.current);
  }

  const handleTimeUpdate = () => {   
    const currentPercentage = getPercentageOfPlayedVideo();
    paintProgressBar(currentPercentage);
    moveProgressBarDot(currentPercentage);
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
    resetProgressBarDot();
  }

  const resetProgressBarDot = () => {
    const currentProgressBarDotRef = progressBarDotRef.current;
    setTranslate(0, currentProgressBarDotRef);
  }

  function dragStart(e:any) {
    const currentProgressBarDotRef = progressBarDotRef.current;
    if (e.target === currentProgressBarDotRef) {
      videoRef.current.pause();
      active = true;
    }
  }

  const dragEnd = (e:DragEvent) => {      
    const videoElement:HTMLVideoElement = videoRef.current;  
    const currentXPosition = (e.clientX - 48)
    const { duration } = videoElement;
    const totalWidth = progressBarWrapperRef.current.clientWidth;
    const calculatedPercentage = currentXPosition * (100 / totalWidth);
    const calculatedCurrentTime = calculatedPercentage * (duration / 100);

    videoRef.current.currentTime = calculatedCurrentTime
    active = false;
    currentX = currentXPosition;

    setTimeout(() => {
      videoRef.current.play();
    }, 500);
  }

  const drag = (e:any) => {
    if (active) {
      e.preventDefault();
      const dragItem = progressBarDotRef.current;
    
      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - 48;
      } else {
        currentX = e.clientX - 48;
      }
      
      paintProgressBar(getPercentageOfPlayedVideoByCurrentPosition(currentX));
      setTranslate(currentX, dragItem);
    }
  }

  const setTranslate = (xPos:number, el:any) => {
    const minX = 0; 
    const maxX = progressBarWrapperRef.current.clientWidth;

    if (xPos >= minX && xPos <= maxX) {
      el.style.transform = `translate3d(${xPos}px, 0, 0)`;
    }
  }

  useEffect(() => {
    const currentVideoRef:HTMLVideoElement = videoRef.current;
    const progressBarWrapperRefCurrent = progressBarWrapperRef.current;

    currentVideoRef.addEventListener('timeupdate', handleTimeUpdate, true);

    progressBarWrapperRefCurrent.addEventListener('touchstart', dragStart, false);
    progressBarWrapperRefCurrent.addEventListener('touchend', dragEnd, false);
    progressBarWrapperRefCurrent.addEventListener('touchmove', drag, false);

    progressBarWrapperRefCurrent.addEventListener('mousedown', dragStart, false);
    progressBarWrapperRefCurrent.addEventListener('mouseup', dragEnd, false);
    progressBarWrapperRefCurrent.addEventListener('mousemove', drag, false);

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
        width={width}
        height={height}
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
      <div 
        ref={progressBarWrapperRef} 
        className={styles.wvcProgressBarWrapper}
        
      >
        <div 
          ref={progressBarRef} 
          className={styles.wvcProgressBar} 
        
        />
        <span ref={progressBarDotRef} className={styles.wvcDot}></span>
      </div>      
      <button onClick={() => handlePlayControl(videoRef.current)}>play</button>
      <button onClick={() => handlePauseControl(videoRef.current)}>pause</button>
      <button onClick={() => handleStopControl(videoRef.current)}>stop/reset</button>
    </div>
  )
}
