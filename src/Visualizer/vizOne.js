import React from 'react';
import PropTypes from 'prop-types';

//Canvas variables not apart of class
let ctx, center_x, center_y, radius, x_end, y_end, bar_height;
const width = 1000;
const height = 710;
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
        center_x = canvas.width / 2;
        center_y = canvas.height / 2;
    
        ctx = canvas.getContext("2d");
    
        for (var i = 0; i < bars; i++) {
            const rads = Math.PI * 2 / bars;
    
            bar_height = this.props.frequency_array[i] * 2;
    
            const x = center_x + Math.cos(rads * i) * (radius);
            const y = center_y + Math.sin(rads * i) * (radius);
            x_end = center_x + Math.cos(rads * i) * (radius + bar_height);
            y_end = center_y + Math.sin(rads * i) * (radius + bar_height);
            
    
            this.drawBar(x, y, x_end, y_end, this.props.frequency_array[i], ctx, canvas);
        }
    }
    
    drawBar(x1=0, y1=0, x2=0, y2=0, frequency, ctx, canvas) {

    
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(35, 7, 77, 1)");
      gradient.addColorStop(1, "rgba(204, 83, 51, 1)");
      ctx.fillStyle = gradient;
    
      const lineColor = this.props.color;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = bar_width;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
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
      return(
        <>
        <canvas ref={this.canvas} />
        </>
      )
    }
}

vizOne.propTypes = {
  frequency_array: PropTypes.object,
  analyser: PropTypes.any, 
}

export default vizOne;