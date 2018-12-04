import React from 'react';
import settings from '../configuration/Settings';
import PreloaderLogo from "../images/preloader_logo.svg";

import Screen from '../core/Screen';

class LoaderScreen extends Screen {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.loading=true;
  }

  componentDidUpdate(prevProps, prevState) {
    if ((this.props.state)&&(this.loading)){
      if ((this.props.state.screens)&&(this.props.state.dialogs)) {
        this.loading=false;
        this.dispatchEvent("onComplete",{source:this.props.id});
      }
    }
  }

  render() {
    return (
      <div
          className="screen loader-screen"
          style={{
            ...this.styles
          }}
        >
        <div className="preloader-container">
          <div className="preloader"></div>
        </div>
        <img
          src={PreloaderLogo}
          width="20%"
          height="20%"
          className="preload-image"
          alt={settings.texts.loaderScreen.title}
          title={settings.texts.loaderScreen.title}
        />
      </div>
    );
  }
}


export default LoaderScreen;
