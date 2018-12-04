import React from 'react';
import settings from '../configuration/Settings';
import PreloaderLogo from "../images/preloader_logo.svg";

import Screen from '../core/Screen';

class InitScreen extends Screen {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
          className="screen init-screen"
          style={{
            ...this.styles
          }}
        >
        <img
          src={PreloaderLogo}
          width="20%"
          height="20%"
          className="preload-image"
          alt={settings.texts.initScreen.title}
          title={settings.texts.initScreen.title}
        />
      </div>
    );
  }
}

export default InitScreen;
