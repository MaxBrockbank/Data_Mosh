import React from 'react'
import { withFirestore } from 'react-redux-firebase';
import firebase from 'firebase/app'
import "firebase/storage";
import VizOne from './vizOne';

class Canvas extends React.Component{
  constructor(props){
    super(props);
    this.canvas = React.createRef()
    this.state = {
      context: null,
      audio: null,
      audioList:[],
    }
  }
  togglePlay = (audio, source) => {
    this.setState({
      audio: audio
    })
    if(audio.paused){
      if(this.context !== undefined){
        this.freqArray(source);
      }
      this.state.audioList.map(song => {
        song.audio.pause();
        if(song.audio !== audio){
          song.audio.currentTime = 0;
        }
      })
      audio.play()
      console.log(this.canvas.current)
      requestAnimationFrame(this.canvas.current.tick);
    } else {
      audio.pause();
      cancelAnimationFrame(this.canvas.rafId);
    }
  }

  freqArray(source){
      this.state.context.resume()
      this.analyser = this.state.context.createAnalyser();
      source.connect(this.analyser);
      this.analyser.connect(this.state.context.destination);
      this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
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

    return(
      <>
      {this.state.audioList.map((song, index) => {
        return <button className="playbuttons"
        onClick={(event) => {
          this.togglePlay(song.audio, song.source)
          document.querySelectorAll('.playbuttons').forEach( button => button.style.backgroundColor = null)
          event.target.style.backgroundColor= !song.audio.paused ? "lightgreen" : "tomato"
        }}
        key={index}>{song.name.slice(0,-4)}
        </button>
      })}
      <VizOne ref={this.canvas} frequency_array = {this.frequency_array} analyser={this.analyser} />
      </>
    );
  }
}

export default withFirestore(Canvas);
