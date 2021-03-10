import React from 'react';
import PropTypes from 'prop-types';

//Canvas variables not apart of class
let ctx;
const width = 1100;
const height = 700;


class vizTwo extends React.Component{

  constructor(props){
    super(props);
    this.canvas = React.createRef();
  }
  animationLooper(canvas) {
        canvas.width = width;
        canvas.height = height;
    
        ctx = canvas.getContext("2d");
    
        this.drawLine(ctx, canvas);
    }
    
    drawLine(ctx, canvas) {
    
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, width, height);


      ctx.lineWidth = 6;
      ctx.strokeStyle = this.props.color;
      ctx.beginPath();

      var sliceWidth = width * 1.0 / this.props.analyser.frequencyBinCount;
      var x = 0;

      for(let i = 0; i < this.props.analyser.frequencyBinCount; i++) {

        let v = this.props.frequency_array[i] / 132.0;
        let y = v * height/2;

        if(i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height/2);
      ctx.stroke();
    }
    
    tick = () => {
      if(this.canvas.current !== null){
        this.animationLooper(this.canvas.current);
        this.props.analyser.getByteTimeDomainData(this.props.frequency_array);
        this.rafId = requestAnimationFrame(this.tick);
      } else {
        return 
      }
    }
  
    render(){
      const viz = <canvas ref={this.canvas} />
      return(
        <>
        {viz}
        </>
      )

    }
}

vizTwo.propTypes = {
  frequency_array: PropTypes.object,
  analyser: PropTypes.any
}

export default vizTwo;