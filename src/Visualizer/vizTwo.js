import React from 'react';
import PropTypes from 'prop-types';

//Canvas variables not apart of class
let ctx, center_x, center_y, radius, x_end, y_end, bar_height;
const width = window.innerWidth;
const height = window.innerHeight;
const bars = 1000;
const bar_width = 1;
radius = 0;
center_x = width / 2;
center_y = height / 2;

class vizOne extends React.Component{

  constructor(props){
    super(props);
    this.canvas = React.createRef();
  }
  animationLooper(canvas) {
        canvas.width = width;
        canvas.height = height;
    
        ctx = canvas.getContext("2d");
    
        for (var i = 0; i < bars; i++) {
            const rads = Math.PI * 2 / bars;
    
            bar_height = this.props.frequency_array[i] * 2;
    
            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
            
    
            this.drawLine(ctx, canvas);
        }
    }
    
    drawLine(ctx, canvas) {
    
      ctx.fillStyle = 'rgb(200, 200, 200)';
      ctx.fillRect(0, 0, width, height);


      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(0, 0, 0)';
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
      this.animationLooper(this.canvas.current);
      this.props.analyser.getByteTimeDomainData(this.props.frequency_array);
      this.rafId = requestAnimationFrame(this.tick);
    }
  
    render(){

      return(
        <canvas ref={this.canvas} />
      )

    }
}

vizOne.propTypes = {
  frequency_array: PropTypes.array,
  analyser: PropTypes.node
}

export default vizOne;