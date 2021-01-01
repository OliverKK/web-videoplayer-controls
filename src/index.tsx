import React, { useEffect } from 'react'

import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import { FaStop } from 'react-icons/fa';

import '@csstools/normalize.css';
import {
  Video, VideoWrapper, Dot,
  ProgressBar, ProgressBarWrapper, Button
} from './styles'

interface VideoObject {
  src: string,
  type: string
}

interface Props {
  videos?: Array<VideoObject>,
  width?: string,
  height?: string,
  controls?: boolean,
  poster?: string,
}

export const ExampleComponent = ({
  videos = [],
  width = '100%',
  height = '100%',
  controls = false,
  poster = '',
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
    const dot = progressBarDotRef.current;
    dot.style.transition = 'transform 1s linear';
    currentVidRef.play();
  }

  const handleTogglePlayVideoControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.paused ? handlePlayControl(currentVidRef) : handlePauseControl(currentVidRef)
  }

  const handlePauseControl = (currentVidRef:HTMLVideoElement) => {
    if (!currentVidRef) return;
    currentVidRef.pause();
    const dot = progressBarDotRef.current;
    dot.style.transition = 'transform 0.01s linear';
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

  const dragEnd = (e:any) => {
    const videoElement:HTMLVideoElement = videoRef.current;
    const currentXPosition = e.type === 'touchend' ? e.changedTouches[0].clientX - 48 : e.clientX - 48;
    const { duration } = videoElement;
    const totalWidth = progressBarWrapperRef.current.clientWidth;
    const calculatedPercentage = currentXPosition * (100 / totalWidth);
    const calculatedCurrentTime = calculatedPercentage * (duration / 100);

    videoRef.current.currentTime = calculatedCurrentTime
    active = false;
    currentX = currentXPosition;

    videoRef.current.play();
  }

  const drag = (e:any) => {
    if (active) {
      e.preventDefault();
      const dot = progressBarDotRef.current;

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX - 48;
      } else {
        currentX = e.clientX - 48;
      }

      paintProgressBar(getPercentageOfPlayedVideoByCurrentPosition(currentX));
      setTranslate(currentX, dot);
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

    progressBarWrapperRefCurrent.addEventListener('touchstart', dragStart, true);
    progressBarWrapperRefCurrent.addEventListener('touchend', dragEnd, true);
    progressBarWrapperRefCurrent.addEventListener('touchmove', drag, true);

    progressBarWrapperRefCurrent.addEventListener('mousedown', dragStart, true);
    progressBarWrapperRefCurrent.addEventListener('mouseup', dragEnd, true);
    progressBarWrapperRefCurrent.addEventListener('mousemove', drag, true);

    return () => {
      currentVideoRef.removeEventListener('timeupdate', handleTimeUpdate, true);
    }
  }, [])

  return (
    <VideoWrapper>
      <Video
        onClick={() => handleTogglePlayVideoControl(videoRef.current) }
        ref={videoRef}
        width={width}
        height={height}
        controls={controls}
        loop={false}
        poster={poster}
        muted
      >
        {
          videos.map(({ src, type }:VideoObject) => {
            return <source src={src} type={type} key={`${type}-${btoa(src)}`}/>
          })
        }
        This browser does not support the HTML5 video element.
      </Video>
      <ProgressBarWrapper ref={progressBarWrapperRef} >
        <ProgressBar ref={progressBarRef} />
        <Dot ref={progressBarDotRef} />
      </ProgressBarWrapper>
      <Button onClick={() => handlePlayControl(videoRef.current)}><FaPlay /></Button>
      <Button onClick={() => handlePauseControl(videoRef.current)}><FaPause /></Button>
      <Button onClick={() => handleStopControl(videoRef.current)}><FaStop /></Button>
    </VideoWrapper>
  )
}
