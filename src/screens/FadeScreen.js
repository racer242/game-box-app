import React from 'react';
import settings from '../configuration/Settings';

import Screen from '../core/Screen';
import PreloaderLogo from "../images/preloader_logo.svg";

class FadeScreen extends Screen {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
          className="fade"
          style={{
            ...this.styles,
            // visibility:this.props.isOn?"visible":"hidden",
            opacity:this.props.isOn?"1":"0",
          }}
        >
        <div className="preloader-container">
          <div className="preloader intermedia"></div>
        </div>
        <img
          src={PreloaderLogo}
          width="20%"
          height="20%"
          className="preload-image intermedia"
          alt={settings.texts.initScreen.title}
          title={settings.texts.initScreen.title}
        />
      </div>
    );
  }
}

export default FadeScreen;
