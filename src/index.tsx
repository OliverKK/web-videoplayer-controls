import * as React from 'react'
import styles from './styles.module.css'

interface Props {
  title?: string,
  videos?: Array<string>,    // List of urls to videos  
  width?: number|string,     // 40 or '40px'
  height?: number|string,    // 40 or '40px'
}

export const ExampleComponent = ({ 
  title = 'Web Video Player with custom contols 😄',
  width = '100%',
  height = '350px',
}: Props) => {
  return (
    <div className={styles.test}>
      <h5>{title}</h5>
      <video controls width={width} height={height} muted>
        <source src="https://www.odt.net/static/media/Skills-teaser.e85b7707.webm" type="video/webm" />
        <source src="https://www.odt.net/static/media/Skills-teaser.e85b7707.mp4" type="video/mp4" />
        This browser does not support the HTML5 video element.
      </video>
    </div>
  )
}
