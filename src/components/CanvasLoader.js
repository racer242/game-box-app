import React from 'react';
import ResizableBox from '../core/ResizableBox';
import settings from '../configuration/Settings';

import AdaptiveCanvas from './AdaptiveCanvas';

import createjs from 'yuki-createjs';

class CanvasLoader extends ResizableBox {

  constructor(props) {
    super(props);

    this.errorHandler = this.errorHandler.bind(this);
    this.fileLoadHandler = this.fileLoadHandler.bind(this);
    this.completeHandler = this.completeHandler.bind(this);
    this.interactionHandler = this.interactionHandler.bind(this);
    this.activateHandler = this.activateHandler.bind(this);

    this.libSource="";
    this.asset="";

    this.state = {
      lib:null,
    };

    this.loaded=false;
  }

  componentDidMount() {
    this.loadAssets();
  }

  getCanvasProps() {
    return {
      canvas:this.refs["AdaptiveCanvas"+this.props.id].canvas,
      stage:this.refs["AdaptiveCanvas"+this.props.id].stage,
      root:this.refs["AdaptiveCanvas"+this.props.id].exportRoot,
      lib:this.refs["AdaptiveCanvas"+this.props.id].lib,
    }
  }


  componentDidUpdate(prevProps, prevState) {
    this.loadAssets();
  }

  componentWillUnmount() {
    this.destroy();
  }

  loadAssets() {
    if (this.libSource!==this.props.libSource) {

      this.unloadContent();

      this.lastLib={};
      for (let assetId in window.lib) {
        this.lastLib[assetId]=true;
      }

      console.log("loadAssets from",this.props.libSource);
      this.libSource=this.props.libSource;
      this.images={};
      let manifest=this.props.manifest.concat([{src:this.libSource}]);
      this.loader = new window.createjs.LoadQueue(false);
      this.loader.addEventListener("error", this.errorHandler);
      this.loader.addEventListener("fileload", this.fileLoadHandler);
      this.loader.addEventListener("complete", this.completeHandler);
      this.loader.loadManifest(manifest);
      this.loaded=false;
    } else
    {
      if (this.asset!=this.props.asset) {
        this.asset=this.props.asset;
        this.dispatchEvent("onComplete");
      }
    }
  }

  errorHandler(event) {
     console.log("errorHandler:",event);
  }

  fileLoadHandler(event) {
    console.log("fileLoadHandler:",event);
	  if (event.item.type == "image") {
      console.log("image");
      this.images[event.item.id] = event.result;
    }
  }

  completeHandler(event) {
    console.log("completeHandler",event);
    for (var assetId in this.images) {
      window.images[assetId]=this.images[assetId];
    }

    this.newAssets=[];
    for (let assetId in window.lib) {
      if (!this.lastLib[assetId]) {
        this.newAssets.push(assetId);
      }
    }

    this.setState({
      ...this.state,
      lib:window.lib,
    });
    this.dispatchEvent("onComplete");
  }

  destroyLoader() {
    if (this.loader) {
      this.loader.removeAllEventListeners();
      this.loader=null;
    }
  }

  unloadContent() {
    if (this.loader) {
      let items = this.loader.getItems();
      for (let i = 0; i < items.length; i++) {
        if ((items[i].item)&&(items[i].item.type==="javascript")) {
          let src = items[i].item.src;
          let allSuspects=document.getElementsByTagName("script");
          for (let j=allSuspects.length; j>=0; j--) {
            if (allSuspects[j] && allSuspects[j].getAttribute("src")!=null && allSuspects[j].getAttribute("src").indexOf(src)!=-1) {
              allSuspects[j].parentNode.removeChild(allSuspects[j]);
            }
          }
        }
      }
      this.loader.removeAll();
    }



    if (this.newAssets) {
      for (var i = 0; i < this.newAssets.length; i++) {
        delete window.lib[this.newAssets[i]];
      }
      this.newAssets=null;
    }


  }

  destroy() {
    this.unloadContent();
    this.destroyLoader();
  }

  interactionHandler(data) {
    this.dispatchEvent("onInteraction",data);
  }

  activateHandler(data) {
    this.dispatchEvent("onActivate",data);
  }

  render() {
    return (
        <AdaptiveCanvas
          ref={"AdaptiveCanvas"+this.props.id}
          id={this.props.id}
          left={this.props.left}
          top={this.props.top}
          width={this.props.width}
          height={this.props.height}

          snapToPixel={this.props.snapToPixel}

          isTransparent={this.props.isTransparent}

          lib={this.state.lib}
          asset={this.props.asset}


          onInteraction={this.interactionHandler}
          onActivate={this.activateHandler}
        />
    );
  }
}

export default CanvasLoader;
