import React from 'react';
import ReactPlayer from 'react-player';


const ResponsivePlayer = ({ url }) => {
    return (
        <div className='player-wrapper'>
        <ReactPlayer
          className='react-player'
          url={url}
          // url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
          width='100%'
          height='100%'
          controls={true}         
        />
      </div>
    )
}

export default ResponsivePlayer

