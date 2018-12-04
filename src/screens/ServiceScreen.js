import React from 'react';
import settings from '../configuration/Settings';

import Screen from '../core/Screen';

import { toScreen } from '../actions/screenActions';

import CanvasLoader from '../components/CanvasLoader';

class ServiceScreen extends Screen {

  constructor(props) {
    super(props);
    this.interactionHandler = this.interactionHandler.bind(this);
    this.canvas_completeHandler = this.canvas_completeHandler.bind(this);
    this.activateHandler = this.activateHandler.bind(this);
  }

  componentDidMount() {
    this.canvas=this.refs.ServiceCanvasLoader;
  }

  canvas_completeHandler(event) {
    console.log("CanvasLoader onComplete",event);
    this.dispatchEvent("onLoadComplete");
  }

  interactionHandler(data) {
    console.log("interactionHandler");
    let source = data.source;
    let type = source.substr(0,1);
    let index = source.substr(1);
    switch (type) {
      case "b": {
        let variant=this.props.state.currentScreenState.variants[index];
        console.log("variant =",variant);

        if (variant.action) {
          this.dispatchEvent("onComplete",{actionId:variant.action});
        } else {
          this.dispatchEvent("onComplete",{action:toScreen,params:{index:index,...data.params}});
        }
        break;
      }
      default:
    }
  }

  activateHandler(data) {
  }

  getRenderParameters() {

    let shortSize=this.props.width;
    let longSize=this.props.height;
    let isPortrait = true;
    if (this.props.width>this.props.height) {
      isPortrait = false;
      shortSize=this.props.height;
      longSize=this.props.width;
    }
    let containerSize=shortSize;

    let containerWidth=containerSize;
    let containerHeight=containerSize;

    let containerLeft=Math.round((this.props.width-containerWidth)*.5);
    let containerTop=Math.round((this.props.height-containerHeight)*.5);

    return {
      width:Math.floor(containerWidth),
      height:Math.floor(containerHeight),
      left:Math.floor(containerLeft),
      top:Math.floor(containerTop,)
    }
  }


  render() {

    return (
      <div
          className="screen service-screen"
          style={{
            ...this.styles
          }}
        >
        <CanvasLoader

          ref="ServiceCanvasLoader"

          id="Service"

          snapToPixel={true}

          left={this.props.left}
          top={this.props.top}

          width={this.props.width}
          height={this.props.height}

          manifest={this.props.manifest}
          libSource={this.props.libSource}
          asset={this.props.asset}

          onComplete={this.canvas_completeHandler}
          onInteraction={this.interactionHandler}
          onActivate={this.activateHandler}
        />


      </div>
    );
  }
}

export default ServiceScreen;
