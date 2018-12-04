import React from 'react';
import ResizableBox from '../core/ResizableBox';
import settings from '../configuration/Settings';

import { callLater } from '../core/helpers'

import createjs from 'yuki-createjs';


class AdaptiveCanvas extends ResizableBox {

  constructor(props) {
    super(props);

    this.state = {
    };

    this.lib=null;
    this.asset=null;

    this.exportRoot_activateHandler = this.exportRoot_activateHandler.bind(this);
    this.exportRoot_finishHandler = this.exportRoot_finishHandler.bind(this);
    this.exportRoot_clickHandler = this.exportRoot_clickHandler.bind(this);
    this.exportRoot_interactionHandler = this.exportRoot_interactionHandler.bind(this);


  }

  componentDidMount() {
    console.log(window.createjs);
    this.canvas = document.getElementById("canvas"+this.props.id);
    this.stage = new window.createjs.Stage(this.canvas);
    this.stage.update();
    this.stage.enableMouseOver();

    if (this.props.snapToPixel) {
      this.stage.snapToPixelEnabled=this.props.snapToPixel;
      this.stage.snapToPixel=this.props.snapToPixel;
    }

    window.createjs.Ticker.setFPS(30);
    this.tickListener=window.createjs.Ticker.addEventListener("tick", this.stage);
    this.container = document.getElementById("canvasContainer"+this.props.id);
    this.canvasNativeWidth=settings.nominalWidth;
    this.canvasNativeHeight=settings.nominalHeight;
    this.updateExportRoot()
    this.updateDimensions();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updateExportRoot();
    this.updateDimensions();
  }

  componentWillUnmount() {
    this.destroy();
  }


  getDevicePixelRatio () {
    let pixelRatio = 1;
    if (navigator.platform.indexOf('Mac') > -1) {
      pixelRatio = 1; //2
    } else {
      pixelRatio = window.devicePixelRatio || 1;
    }
    return pixelRatio;
  }

  updateDimensions() {



    let width=this.props.width;
    let height=this.props.height;

    let scale=Math.min(width/this.canvasNativeWidth,height/this.canvasNativeHeight);

    let pRatio=this.getDevicePixelRatio();

    if (this.lastWidth!==width) {
      this.canvas.width=width*pRatio;
      this.lastWidth=width;
    }
    if (this.lastHeight!==height) {
      this.canvas.height=height*pRatio;
      this.lastHeight=height;
    }

    if (this.lastScale!==scale) {
      this.stage.scaleX=
      this.stage.scaleY=scale*pRatio;
      this.lastScale=scale;
    }

    if (this.exportRoot) {
      this.exportRoot.x=(width/scale-this.canvasNativeWidth)/2;
      this.exportRoot.y=(height/scale-this.canvasNativeHeight)/2;
    }
  }

  updateExportRoot() {

    if ((this.lib!==this.props.lib)||(this.asset!==this.props.asset)) {

      if ((this.props.lib)&&(this.props.asset)&&(this.props.lib[this.props.asset])) {

        // console.log("AdaptiveCanvas update Export Root",this.asset,this.props.asset);

        this.lib=this.props.lib;
        this.asset=this.props.asset;

        this.destroyExportRoot();


        let assetClass=this.props.lib[this.props.asset];

        this.exportRoot = new assetClass();
        this.exportRoot.snapToPixel=true;

        for (var name in this.exportRoot) {
          if (this.exportRoot[name] instanceof window.createjs.MovieClip) {
           this.exportRoot[name].name=name;

          }
        }

        this.stage.addChild(this.exportRoot);
        this.exportRoot.on("activate",this.exportRoot_activateHandler);
        this.exportRoot.on("finish",this.exportRoot_finishHandler);
        this.exportRoot.on("click",this.exportRoot_clickHandler);
        this.exportRoot.on("interaction",this.exportRoot_interactionHandler);

      }
    }
  }

  destroyExportRoot() {
    if (this.exportRoot) {
      if (this.exportRoot.stop) {
        this.exportRoot.stop();
      }
      this.exportRoot.removeAllEventListeners();
      this.exportRoot.removeAllChildren();
    }
  }

  destroy() {
    this.destroyExportRoot();
    window.createjs.Ticker.removeEventListener("tick",this.tickListener);
  }

  exportRoot_activateHandler(event) {
    // console.log("exportRoot_activateHandler",event);
    this.dispatchEvent("onActivate",event.data);
  }

  exportRoot_finishHandler(event) {
    // console.log("exportRoot_finishHandler",event);
  }

  exportRoot_clickHandler(event) {
    // console.log("exportRoot_clickHandler",event.target.name);
    let targetName=event.target.name;
    if (targetName) {
      this.dispatchEvent("onInteraction",{source:targetName});
    }
  }

  exportRoot_interactionHandler(event) {
    // console.log("exportRoot_interactionHandler",event.target.name);
    this.dispatchEvent("onInteraction",event.data);
  }

  render() {
    return (

      <div id={"canvasContainer"+this.props.id}
          className="canvas-container"
          style={
            {
              ...this.styles,
              pointerEvents:(this.props.isTransparent?"none":"auto"),
            }
          }
        >
        <canvas
          id={"canvas"+this.props.id}
          width="0"
          height="0"
          style={
            {
              width:"100%",
              height:"100%",
            }
          }
        ></canvas>
      </div>

    );
  }
}

// function makeResponsive(isResp, respDim, isScale, scaleType) {
//   let canvasContainer = document.getElementById("canvasContainer"+this.props.id);
//
//   function resizeCanvas() {
//     var w = 240, h = 400;
//     var iw = window.innerWidth, ih=window.innerHeight;
//     var xRatio=iw/w, yRatio=ih/h, sRatio=1;
//
//     var pRatio=getDevicePixelRatio();
//     if(isResp) {
//       if(!isScale) {
//         if(iw<w || ih<h)
//           sRatio = Math.min(xRatio, yRatio);
//       }
//     }
//     canvas.width = w*pRatio*sRatio;
//     canvas.height = h*pRatio*sRatio;
//     canvas.style.width = canvasContainer.style.width = w*sRatio+'px';
//     canvas.style.height = canvasContainer.style.height = h*sRatio+'px';
//     stage.scaleX = pRatio*sRatio;
//     stage.scaleY = pRatio*sRatio;
//   }
// }






export default AdaptiveCanvas;
