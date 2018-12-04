import React, { Component } from 'react';
import screenfull from 'screenfull'

import Dispatcher from './Dispatcher';
import settings from '../configuration/Settings'

import { switchSound, fullScreen } from '../actions/appActions';

import { screens } from './screenMap';

import FadeScreen from '../screens/FadeScreen';


import { getScreenStuff } from './helpers';

import InformationScrollablePopup from '../components/InformationScrollablePopup';

import SoundButton from '../components/SoundButton';

import ReactAudioPlayer from 'react-audio-player';


class Container extends Component {

  constructor(props) {
    super(props);

    this.screen_completeHandler=this.screen_completeHandler.bind(this);
    this.screen_loadCompleteHandler=this.screen_loadCompleteHandler.bind(this);

    this.fullScreenSwitchedHandler=this.fullScreenSwitchedHandler.bind(this);
    this.fullscreenChangeHandler=this.fullscreenChangeHandler.bind(this);

    this.screen_actionHandler=this.screen_actionHandler.bind(this);
    this.informationPopup_completeHandler=this.informationPopup_completeHandler.bind(this);

    this.soundButton_clickHandler=this.soundButton_clickHandler.bind(this);

    this.store = this.props.store;

    this.store.subscribe(()=>{this.onStoreChange()});
  }

  onStoreChange() {
    this.setState(this.store.getState());
  }

/* ++++ React methods ++++ */

  componentWillMount() {
    screenfull.onchange(this.fullscreenChangeHandler);
  }

  componentDidMount() {
    Dispatcher.subscribe("onResize",this);
  }

  onResize() {
  }

// ---- Full screen implementation

  openFullScreen() {
    this.store.dispatch(fullScreen(true));
  }

  closeFullScreen() {
    this.store.dispatch(fullScreen(false));
  }

  switchFullScreen(isFullScreen) {
    this.store.dispatch(fullScreen(isFullScreen));
  }

  updateFullScreen() {
    if (screenfull.enabled) {
      if (this.state.isFullScreen) {
        if (!screenfull.isFullscreen) {
          screenfull.request();
        }
      } else {
        if (screenfull.isFullscreen) {
          screenfull.exit();
        }
      }
    } else {
      console.log("Fullscreen isn't supported");
    }
  }

  fullScreenSwitchedHandler() {
    if (this.state.isFullScreen) {
      this.closeFullScreen();
    } else {
      this.openFullScreen();
    }
  }

  fullscreenChangeHandler() {
    console.log("fullscreenChangeHandler");
    this.switchFullScreen(screenfull.isFullscreen);
  }


  soundButton_clickHandler() {
    this.refs.AudioPlayer.audioEl.play();
    this.store.dispatch(switchSound());
  }

/* ++++ Components event handlers ++++ */

  screen_completeHandler(data) {
    Dispatcher.dispatch("onScreenComplete",data);
  }

  screen_loadCompleteHandler(data) {
    Dispatcher.dispatch("onScreenLoadComplete",data);
  }

  screen_actionHandler(data) {
    Dispatcher.dispatch("onAction",data);
  }

  informationPopup_completeHandler(data) {
    Dispatcher.dispatch("onPopupComplete","information",data);
  }

  render() {

    let children = [];
    children.push(this.props.children);

    if ((this.state)&&(screens[this.state.currentScreen])) {

      this.updateFullScreen();

      console.log("Render Container",this.state);

      let currentScreenSettings=screens[this.state.currentScreen];
      let currentScreenState=this.state.currentScreenState;
      let currentScreenStuff=getScreenStuff(currentScreenSettings,currentScreenState,this.state.mod);
      children.push(React.createElement(
        currentScreenSettings.factory,
        {
          id:this.state.currentScreen,
          width:this.props.width,
          height:this.props.height,
          windowWidth:this.props.windowWidth,
          windowHeight:this.props.windowHeight,
          scale:this.props.scale,
          left:0,
          top:0,
          key:'Screen',

          manifest:currentScreenStuff.manifest,
          libSource:currentScreenStuff.lib,
          asset:currentScreenStuff.asset,
          path:currentScreenStuff.path,
          extraStuff:currentScreenStuff.extraStuff,

          data:this.state.currentScreenData,
          state:this.state,
          store:this.store,
          onLoadComplete:this.screen_loadCompleteHandler,
          onComplete:this.screen_completeHandler,
          onAction:this.screen_actionHandler
        }
      ));


      if ((this.state.information)&&((!this.state.helpers)||(this.state.information.options&&this.state.information.options.helpersAllowed))) {
        children.push(
          <InformationScrollablePopup
            key='InformationScrollablePopup'
            title={this.state.information.title}
            description={this.state.information.description}
            text={this.state.information.text}
            align={this.state.information.align}
            closable={this.state.information.closable}
            options={this.state.information.options}
            left="0"
            top="0"
            width={this.props.width}
            height={this.props.height}
            onComplete={this.informationPopup_completeHandler}
          />
        );
      }

      children.push(
        <FadeScreen
          key='Fade'
          left="0"
          top="0"
          width={this.props.width}
          height={this.props.height}
          isOn={this.state.fade}
        />
      );

// <source src={currentScreenStuff.sound+".mp3"} type="audio/mpeg"/>
// <source src={currentScreenStuff.sound+".ogg"} type="audio/ogg; codecs=vorbis" />
      if (currentScreenStuff.sound) {
        children.push(

          <ReactAudioPlayer
            key="Audio"
            ref="AudioPlayer"
            src={currentScreenStuff.sound+".mp3"}
            autoPlay={true}
            loop={true}
            volume={settings.soundVolume[currentScreenSettings.sound]*this.state.volume}
          >
          </ReactAudioPlayer>

        );
        children.push(
          <SoundButton
            key="SoundButton"
            id="SoundButton"
            isVisible={true}
            isIncluded={true}
            isEnabled={true}
            volume={this.state.volume}
            onClick={this.soundButton_clickHandler}
          />
        );
      }

    }

    return React.createElement(
      'div',
      { id:'Container',
        style:{
          width:this.props.width,
          height:this.props.height,
          left:this.props.left,
          top:this.props.top
        }

      },
      children
      );
  }
}

export default Container;
