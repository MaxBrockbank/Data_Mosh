import React from 'react'
import songFile from './../Audio/BILLYJOEL.mp3';
import * as BS from 'react-icons/bs'
import { withFirestore } from 'react-redux-firebase';

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

  logStorage = () => {
    this.props.firestore.get({collection:'songs', doc:'9i3lOIV3KYaT82P2iZ9u'}).then((test) => {
      const newStorage = {
        test: test.get("test")
      }
      console.log(newStorage);
    })
  }

  render (){
    return(
      <>
        <button onClick={this.togglePlay}>{this.state.buttonIcon}</button>
        <button onClick ={this.logStorage}>Log Storage</button>
      </>
    );
  }
}

export default withFirestore(Canvas);
