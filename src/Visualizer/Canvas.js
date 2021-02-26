import React from 'react'
import songFile from './../Audio/BILLYJOEL.mp3';

class Canvas extends React.Component{
  constructor(props){
    super(props);
    this.audio = new Audio(songFile);
  }

  togglePlay(){
    if(this.audio.paused){
      this.audio.play()
    } else {
      this.audio.paused();
    }
  }

}

export default Canvas
