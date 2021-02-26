import React from 'react'
import songFile from './../Audio/BILLYJOEL.mp3';
import * as BS from 'react-icons/bs'

class Canvas extends React.Component{
  constructor(props){
    super(props);
    this.audio = new Audio(songFile);
    this.state = {
      buttonIcon:<BS.BsPlayFill/>
    }
  }

  togglePlay = () => {
    if(this.audio.paused){
      this.audio.play()
      this.setState({
        buttonIcon:<BS.BsPauseFill/>
      })
    } else {
      this.audio.pause();
      this.setState({
        buttonIcon:<BS.BsPlayFill/>
      })
    }
  }

  render (){
    return(
      <>
        <button onClick={this.togglePlay}>{this.state.buttonIcon}</button>
      </>
    );
  }
}

export default Canvas
