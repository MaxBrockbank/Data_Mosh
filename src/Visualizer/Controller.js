import React from 'react'
import { withFirestore } from 'react-redux-firebase';
import firebase from 'firebase/app'
import "firebase/storage";
import VizOne from './vizOne';
import VizTwo from './vizTwo';
import DataMosh from './dataMosh';
import './../App.css'
import {Container, Row, Col} from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import ReactColorPicker from '@super-effective/react-color-picker';


class Controller extends React.Component{
  constructor(props){
    super(props);
    this.canvas = React.createRef()
    this.state = {
      context: null,
      audio: null,
      source: null,
      audioList:[],
      currentViz: null,
      color: "#ffd24a"
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

  changeColor(color){
    this.setState({color:color});
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

    let viz ;
    let playButton = null;
    if(this.state.currentViz === "blob"){
      viz =  <VizOne ref={this.canvas} frequency_array = {this.frequency_array} analyser={this.analyser} color={this.state.color}/>;
    } else if(this.state.currentViz === "wave"){
      viz =  <VizTwo ref={this.canvas} frequency_array = {this.frequency_array} analyser={this.analyser} color={this.state.color}/>;
    }
    
    return(
      <>
      <Container fluid style={{padding:0}}>
        <Row style={{width:"100"}} noGutters >
          <Col className="controlPanel" xs={3} md={3} >
            <div className="buttonHub">
              <DataMosh style={{marginBottom:"20px"}} color={this.state.color}/>
              <hr/>
              <h4>Select Animation Type</h4>
              <ButtonGroup aria-label="Basic example" style={{width:"75%"}}>
                <Button className="vizi" variant="outline-light" onClick={(event) => {
                  this.setCurrentViz('blob')
                  document.querySelectorAll('.vizi').forEach(button =>{ 
                    if(button.classList.contains('active')){
                    button.classList.remove('active')
                    }
                  })
                  if(event.target.classList.contains('active')){
                    event.target.classList.remove('active');
                  } else {
                    event.target.classList.add('active');
                  }
                  }}>Blob</Button>
                <Button className="vizi" variant="outline-light" onClick={(event) => {
                  this.setCurrentViz('wave')
                  document.querySelectorAll('.vizi').forEach(button =>{ 
                    if(button.classList.contains('active')){
                    button.classList.remove('active')
                    }
                  })
                  if(event.target.classList.contains('active')){
                    event.target.classList.remove('active');
                  } else {
                    event.target.classList.add('active');
                  }
                  }}>Wave</Button>
                {/* <Button variant="secondary">Right</Button> */}
              </ButtonGroup>
              <hr/>
              <br/>
              <h4>Select Animation Color</h4>
              <ReactColorPicker onChange={(color) => this.changeColor(color)} color={this.state.color} style={{width:'75%', margin: '0 auto'}}/>
              <br/>
              <hr/>
              <h4>Select Song</h4>
              <ButtonGroup vertical style={{width:"75%"}}>
              {this.state.audioList.map((song, index) => {
                return <Button onClick={(event) => {
                  this.togglePlay(song.audio, song.source)
                  document.querySelectorAll('.songButton').forEach(button =>{ 
                    if(button.classList.contains('active')){
                      button.classList.remove('active')
                    }
                  })
                  if(!event.target.classList.contains('active')){
                    event.target.classList.add('active');
                  }
                }}
                className="songButton"
                variant="outline-light"
                key={index}
                >
                  {song.name.slice(0,-4)}
                </Button>
              })}
              </ButtonGroup>
            </div>
          </Col>
          <Col xs={9} md={9}>
          <div className="vizCol" style={{padding:'8px'}}>
            {viz}
          </div>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}

export default withFirestore(Controller);
