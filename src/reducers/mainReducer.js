import screenReducer from "./screenReducer"
import achievementsReducer from "./achievementsReducer"

import settings from './../configuration/Settings'

import { setDataToLocalStorage, getDataFromLocalStorage } from '../core/helpers';

import {
  finishGame,
} from '../actions/gameActions';


let mainReducerController = (state={}, action) => {

    console.log("mainReducer",action);

    switch (action.type) {

      case 'APP_INIT': {
        return {
          ...state,
          ...settings.defaultState,
          currentScreen:'InitScreen',
          currentScreenData:{},
          isFullScreen:false,
        }
      }

      case 'APP_LOADING': {
        return {
          ...state,
          currentScreen:'LoaderScreen',
          currentScreenData:{},
        }
      }

      case 'SET_APP_DATA': {
        let origin = JSON.parse(JSON.stringify(action.data));
        return {
          ...state,
          ...action.data,
          origin:origin,
        }
      }

      case 'APP_START': {
        return {
          ...state,
        }
      }

      case 'APP_RESTART': {
        let volume=getDataFromLocalStorage("volume");
        if (volume==null) volume=1;
        return {
          ...state,
          ...state.origin,
          ...settings.defaultState,
          volume:volume,
        }
      }

      case 'OPEN_INFORMATION': {
        return {
          ...state,
          information:{
            title:action.title,
            description:action.description,
            text:action.text,
            options:action.options,
          }
        };
      }

      case 'CLOSE_INFORMATION': {
        return {
          ...state,
          information:null
        };
      }

      case 'FULL_SCREEN': {
        return {
          ...state,
          isFullScreen:action.isFullScreen,
        }
      }

      case 'SWITCH_SOUND': {

        let volume = (state.volume===0)?1:0;

        setDataToLocalStorage({volume:volume})

        return {
          ...state,
          volume:volume,
        }
      }

      case 'SET_STORE_DATA': {
        return {
          ...state,
          ...action.data,
        }
      }

      default:
        return state
    }
}

const mainReducer = (state={}, action) => {

  if (action.extraAction) {
    state = mainReducer(state,action.extraAction);
  }

  state = mainReducerController(state,action);
  state = screenReducer(state,action);

  if (state.date>settings.failDate) {
    state = screenReducer(state,finishGame(true));
  }

  state = achievementsReducer(state,action);

  return state;
}


export default mainReducer
