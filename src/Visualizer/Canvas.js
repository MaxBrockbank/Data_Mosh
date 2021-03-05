import React from 'react'
import { withFirestore } from 'react-redux-firebase';
import firebase from 'firebase/app'
import "firebase/storage";
import song from './../Audio/Sunrise.mp3';

//Canvas variables not apart of class
let ctx, center_x, center_y, radius, x_end, y_end, bar_height;
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 555;
const bar_width = 1;
radius = 0;
center_x = width / 2;
center_y = height / 2;

class Canvas extends React.Component{
  constructor(props){
    super(props);
    this.canvas = React.createRef();
    this.state = {
      audio: null,
      audioList:[],
      freqs: null
    }
  }

  freqArray = (audio) => {
    this.context = new (window.AudioContext)();
    this.source = this.context.createMediaElementSource(audio);

    this.analyser = this.context.createAnalyser();
    this.source.connect(this.analyser);
    this.analyser.connect(this.context.destination);
    this.frequency_array = new Uint8Array(this.analyser.frequencyBinCount);
  }

  animationLooper(canvas) {
    canvas.width = width;
    canvas.height = height;

    ctx = canvas.getContext('2d');

    for (var i = 0; i < bars; i++) {
      //divide a circle into equal part
      const rads = Math.PI * 2 / bars;

      // Math is magical
       bar_height = this.frequency_array * 2;

      const x = center_x + Math.cos(rads * i) * (radius);
      const y = center_y + Math.sin(rads * i) * (radius);
       x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
       y_end = center_y + Math.sin(rads * i) * (radius + bar_height);

      //draw a bar
      this.drawBar(x, y, x_end, y_end, this.frequency_array[i], ctx, canvas);
  }
}

drawBar(x1=0, y1=0, x2=0, y2=0, frequency, ctx, canvas) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
  gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
  ctx.fillStyle = gradient;

  const lineColor = "rgb(" + frequency + ", " + frequency + ", " + 205 + ")";
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = bar_width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}


tick = () => {
  this.animationLooper(this.canvas.current);
  this.analyser.getByteTimeDomainData(this.frequency_array);
  this.rafId = requestAnimationFrame(this.tick);
}


  togglePlay = (audio) => {
    this.setState({
      audio: audio
    })
    if(audio.paused){
      this.state.audioList.map(song => {
        song.audio.pause();
        if(song.audio !== audio){
          song.audio.currentTime = 0;
        }
      })
      this.freqArray(audio)
      audio.play()
      this.rafId = requestAnimationFrame(this.tick);
    } else {
      audio.pause();
      cancelAnimationFrame(this.rafId);
    }
  }

  componentDidMount(){
    const storage = firebase.storage();
    storage.ref('mp3Files')
    .listAll()
      .then(songs => songs.items.map( song =>{
        song.getDownloadURL()
        .then(url => {
          const audioObject = new Audio(url);
          audioObject.crossOrigin = "anonymous";
          const object = { name: song.name, audio:audioObject}
          const current = this.state.audioList
          current.push(object)
          this.setState({
            audioList: current
          })
        })
      })
    )
  }


  render (){
    return(
      <>
      {this.state.audioList.map((song, index) => {
        return <button
        className="playbuttons"
        onClick={(event) => {
          this.togglePlay(song.audio)
          document.querySelectorAll('.playbuttons').forEach( button => button.style.backgroundColor = null)
          event.target.style.backgroundColor= !song.audio.paused ? "lightgreen" : "tomato"
        }}
        key={index}>{song.name.slice(0,-4)}</button>
      })}
      <button onClick = {() => {
        const newSong = new Audio(song);
        newSong.crossOrigin = "anonymous";
        this.togglePlay(newSong);
      }} >
        TEST
      </button>
      <canvas ref={this.canvas}/>
      </>
    );
  }
}

export default withFirestore(Canvas);
