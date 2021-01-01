import React from 'react'

import { ExampleComponent } from 'web-videoplayer-controls'
import 'web-videoplayer-controls/dist/index.css'

/*const videos = [{
  src: 'https://www.odt.net/static/media/Skills-teaser.e85b7707.mp4 ',
  type: 'video/mp4'
}]*/

const videos = [{
  src: 'https://geezee.de/video/intro-comp.mp4',
  type: 'video/mp4'
}]

const poster = 'https://geezee.de/img/slides/showcase_new.jpg';

const App = () => {
  return (
    <ExampleComponent
      videos={videos}
      poster={poster}
    />
  )
}

export default App
