import React from 'react'
import { withFirestore } from 'react-redux-firebase';
import firebase from 'firebase/app'
import "firebase/storage";
import VizOne from './vizOne';
import VizTwo from './vizTwo';
import './../App.css'
import {Container, Row, Col} from 'react-bootstrap';

class Canvas extends React.Component{
  constructor(props){
    super(props);
    this.canvas = React.createRef()
    this.state = {
      context: null,
      audio: null,
      source: null,
      audioList:[],
      currentViz: null
    }
  }
  togglePlay = (audio, source) => {
    this.setState({
      audio: audio,
      source: source
    })
    
    if(audio.paused){
      this.state.audioList.map(song => {
        song.audio.pause();
        if(song.audio !== audio){
          song.audio.currentTime = 0;
        }
      })
      this.freqArray(source);
      audio.play()
      if(this.state.currentViz !== null && this.canvas.current !== null){
        requestAnimationFrame(this.canvas.current.tick);
      }
    } else {
      audio.pause();
      source.disconnect(this.analyser)
      if(this.state.currentViz !== null){
        cancelAnimationFrame(this.canvas.rafId);
      }
    }
  }

  freqArray(source){
      this.state.context.resume()
      this.analyser = this.state.context.createAnalyser();
      source.connect(this.analyser);
      this.analyser.connect(this.state.context.destination);
      this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
  }
  

  async setCurrentViz(type){
    const {audio, source} = this.state;
    this.setState({
      currentViz: type
    })
    if(audio !== null){
      if(!audio.paused){
        await cancelAnimationFrame(this.canvas.rafId);
        requestAnimationFrame(this.canvas.current.tick);
      }
    }
  }

  componentDidMount(){
    this.state.context = new AudioContext();
    const storage = firebase.storage();
    storage.ref('mp3Files')
    .listAll()
      .then(songs => songs.items.map( song =>{
        song.getDownloadURL()
        .then(url => {
          const audioObject = new Audio(url);
          const source = this.state.context.createMediaElementSource(audioObject);
          audioObject.crossOrigin = "anonymous";
          const object = { name: song.name, audio:audioObject, source:source}
          const currentObjList = this.state.audioList;
          currentObjList.push(object)
          this.setState({
            audioList: currentObjList
          })
        })
      })
    )
  }


  render (){

    let viz;
    let playButton = null;
    if(this.state.currentViz === "blob"){
      viz =  <VizOne ref={this.canvas} frequency_array = {this.frequency_array} analyser={this.analyser} />;
    } else if(this.state.currentViz === "wave"){
      viz =  <VizTwo ref={this.canvas} frequency_array = {this.frequency_array} analyser={this.analyser} />;
    }

    // if(this.state.audio !== null){
    //   playButton = <button onClick={() => {this.togglePlay(this.state.audio, this.state.source)}}>Play/Pause</button>
    // }
    
    return(
      <>
        <div>
        <button onClick={() => this.setCurrentViz('blob')}>Blob</button>
        <button onClick={() => this.setCurrentViz('wave')}>Waveform</button>
        </div>
        {this.state.audioList.map((song, index) => {
          return <button className="playbuttons"
          onClick={() => {
            this.togglePlay(song.audio, song.source)
          }}
          key={index}>{song.name.slice(0,-4)}
          </button>
        })}
      <div>
      {/* {playButton} */}
      {viz}
      </div>
      </>
    );
  }
}

export default withFirestore(Canvas);
