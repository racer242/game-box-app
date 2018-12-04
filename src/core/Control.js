import { Component } from 'react';
import settings from '../configuration/Settings'
import { callLater } from './helpers'
import Dispatcher from './Dispatcher';

import {
  appInit,
  appLoad,
  appStart,
  appRestart,
  setAppData,
  appLaunch
 } from '../actions/appActions';

 import {
   finishGame,
   finishQuiz,
 } from '../actions/gameActions';

 import {
   fadeInAction,
   fadeOutAction,
 } from '../actions/screenActions';


import { openInformation } from '../actions/informationActions';
import { closeInformation } from '../actions/informationActions';
import { screens,  prepareScreens } from './screenMap'

class Control extends Component {

  //--------------------------------------------------------------------------
	//
	// Constructor
	//
	//--------------------------------------------------------------------------

  constructor(props) {
    super(props);
    this.state = {};
    this.store = this.props.store;
    this.store.subscribe(()=>{this.onStoreChange()});

    this.actionMap={
      "finish":finishGame,
      "restart":appRestart,
    }

    this.appStartDelay=500;

  }

  onStoreChange() {
    this.setState(this.store.getState());
  }

  //--------------------------------------------------------------------------
  //
  // React methods
  //
  //--------------------------------------------------------------------------

  componentDidMount() {

    Dispatcher.subscribe("onDataReady",this);
    Dispatcher.subscribe("onScreenComplete",this);
    Dispatcher.subscribe("onScreenLoadComplete",this);

    Dispatcher.subscribe("onAction",this);
    Dispatcher.subscribe("onPopupComplete",this);

    this.applicationInit();

  }

  componentWillUpdate(nextProps, nextState) {

  }

  //--------------------------------------------------------------------------
  //
  // Own methods
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  // Init & start
  //----------------------------------

  applicationInit() {
    console.log("applicationInit");

    prepareScreens();
    console.log(screens);

    this.store.dispatch(appInit());
    callLater(() => {
      this.applicationLoad("full");
    },1000)

    document.addEventListener('touchstart', function(e) {e.preventDefault()}, false);
    document.addEventListener('touchmove', function(e) {e.preventDefault()}, false);

  }

  applicationLoad(quality) {
    console.log("applicationLoad");
    settings.quality=quality;
    settings.hdScale=settings.qualityScaleMap[quality];
    console.log("Quality settings: quality =",settings.quality," scale =",settings.hdScale);
    this.store.dispatch(appLoad());
    Dispatcher.dispatch("onAppLoad");
  }

  applicationStart() {
    console.log("applicationStart");

    callLater(() => {
      Dispatcher.dispatch("onResize");
    }, this.appStartDelay+100);

    callLater(() => {
      this.store.dispatch(appStart());
    }, this.appStartDelay);
  }


    //----------------------------------
    // Steps implementation
    //----------------------------------

  exitApplication() {
    this.store.dispatch(openInformation(
      settings.errorTexts.warningTitle,
      "",
      settings.errorTexts.closeWindowsError
    ));

    try {
      window.close();
    } catch (e) {
      console.log("Close window error.");
    }

  }


  //--------------------------------------------------------------------------
  //
  // Dispatcher handlers
  //
  //--------------------------------------------------------------------------


  onScreenComplete(data) {

    console.log("onScreenComplete",data);

    switch (data.source) {
      case 'initScreen':
        this.applicationLoad(data.quality);
      break;
      case 'LoaderScreen':
        callLater( () => {
          this.store.dispatch(fadeInAction());
        },this.appStartDelay-100);
        this.applicationStart();
        callLater( () => {
          this.store.dispatch(fadeOutAction());
        },this.appStartDelay+100);
      break;
      default: {
        this.store.dispatch(fadeInAction());
        callLater( () => {
          if (data.action) {
            this.store.dispatch(data.action(data.params));
          } else
          if (data.actionId) {
            this.store.dispatch(this.actionMap[data.actionId](data.params));
          }

        },100);

        // callLater( () => {
        //   this.store.dispatch(fadeOutAction());
        // },20000);

      }
    }
  }

  onScreenLoadComplete(data) {
    console.log("onScreenLoadComplete");
    callLater( () => {
      this.store.dispatch(fadeOutAction());
    },100);
  }

  onPopupComplete(popupId,data) {
    console.log("onPopupComplete",popupId,data);
    switch (popupId) {

      case "information": {
        if ((!data)||(data.action==="close")) {
          this.store.dispatch(closeInformation());
        } else {
          this.store.dispatch(data);
        }
        break;
      }

      default:

    }
  }

  onAction(data) {
    console.log("onAction",data);

    switch (data.action) {

      case "restart": {
        this.store.dispatch(appRestart());
        break;
      }

      case "exit": {
        this.exitApplication();
        break;
      }

      case "finishQuiz": {
        this.store.dispatch(finishQuiz(data.data));
        break;
      }

      default:
    }
  }

  //--------------------------------------------------------------------------
  //
  // Event handlers
  //
  //--------------------------------------------------------------------------

  onDataReady(data) {
    this.store.dispatch(setAppData(data));
  }

  //--------------------------------------------------------------------------
  //
  // Render
  //
  //--------------------------------------------------------------------------

  render () {
    return null;
  }

}

export default Control;
