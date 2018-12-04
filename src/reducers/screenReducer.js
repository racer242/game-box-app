import settings from '../configuration/Settings';

import {
  getScreenState,
} from "../core/helpers"

const processAction = (state,action) => {
  if (state.currentScreen) {

  }
  return action;
}

const updateDate = (state,action) => {
  let date=state.date;
  if (action.date) {
    let dateOption=action.date;
    if (String(dateOption).indexOf("+")>=0) {
      console.log("++",Number(dateOption));
      date=Number(date)+Number(dateOption);
    } else
    {
      date=Number(dateOption);
    }
    if (action.minDate) {
      if (Number(date)<action.minDate) {
        date=Number(action.minDate);
      }
    }
  }
  return date;
}

const screenReducer = (state={}, action) => {

    console.log("---------screenReducer",action);
    action=processAction(state,action);

    switch (action.type) {
      case 'APP_START':
      case 'APP_RESTART':
      {
        state = {
          ...state,
          date:updateDate(state,action),
        }
        let currentScreenState=getScreenState(state,settings.firstScreen);
        return {
          ...state,
          currentScreen:currentScreenState.type,
          currentScreenState:currentScreenState,
          currentScreenId:currentScreenState.id,
          currentScreenData:{},
        };
      }

      case 'TO_SCREEN': {
        let currentScreenState=state.currentScreenState;
        let screenId=currentScreenState.id;
        let actionForDate=action;

        if (action.index!=null) {
          if (currentScreenState.variants[action.index]) {
            if (currentScreenState.variants[action.index].link) {
              screenId=currentScreenState.variants[action.index].link;
              actionForDate=currentScreenState.variants[action.index];
            } else {
              console.log("TO_SCREEN: screenId not defined");
            }
          }
        }
        if (action.id!=null) {
          screenId=action.id;
        }
        console.log("TO_SCREEN: id =",screenId,"; index =",action.index,"; id =",action.id);
        state = {
          ...state,
          date:updateDate(state,actionForDate),
        }
        currentScreenState=getScreenState(state,screenId);
        return {
          ...state,
          currentScreen:currentScreenState.type,
          currentScreenState:currentScreenState,
          currentScreenId:currentScreenState.id,
          currentScreenData:{},
        };
      }

      case 'FINISH_GAME':
      {
        let currentScreenState;
        if (action.isFailed) {
          currentScreenState=getScreenState(state,settings.failScreen);
        } else {
          currentScreenState=getScreenState(state,settings.successScreen);
        }
        return {
          ...state,
          currentScreen:currentScreenState.type,
          currentScreenState:currentScreenState,
          currentScreenId:currentScreenState.id,
          currentScreenData:{},
        };
      }

      case 'FADE_IN_ACTION':
      {
        return {
          ...state,
          fade:true,
        };
      }

      case 'FADE_OUT_ACTION':
      {
        return {
          ...state,
          fade:false,
        };
      }

      default:
        return state
    }
}

export default screenReducer
