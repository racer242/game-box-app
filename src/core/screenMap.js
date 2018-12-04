import settings from '../configuration/Settings';


import InitScreen from '../screens/InitScreen';
import LoaderScreen from '../screens/LoaderScreen';
import ServiceScreen from '../screens/ServiceScreen';
import SelectPersonScreen from '../screens/SelectPersonScreen';
import IllustrationScreen from '../screens/IllustrationScreen';
import ComputerScreen from '../screens/ComputerScreen';
import DialogScreen from '../screens/DialogScreen';
import ChatScreen from '../screens/ChatScreen';
import MiniGameScreen from '../screens/MiniGameScreen';
import Find5Screen from '../screens/Find5Screen';
import QuizScreen from '../screens/QuizScreen';
import FinalScreen from '../screens/FinalScreen';
import AchievementScreen from '../screens/AchievementScreen';

export const screens={
  'InitScreen':{
    factory:InitScreen,
    isStatic:true,
  },
  'LoaderScreen':{
    factory:LoaderScreen,
    isStatic:true,
  },
  'v':{
    factory:ServiceScreen,
    isCanvas:true,
    sound:"main",
  },
  'l':{
    factory:SelectPersonScreen,
    isCanvas:true,
    sound:"main",
  },
  'i':{
    factory:IllustrationScreen,
    isModifiable:true,
    sound:"background",
  },
  's':{
    factory:ComputerScreen,
    sound:"background",
  },
  'd':{
    factory:DialogScreen,
    assetsIn:"i",
    isModifiable:true,
    sound:"background",
  },
  'h':{
    factory:ChatScreen,
    assetsIn:"s",
    sound:"background",
  },
  'g':{
    factory:MiniGameScreen,
    isCommonAsset:true,
    sound:"background",
  },
  'o':{
    factory:Find5Screen,
    isCommonAsset:true,
    sound:"background",
  },
  'p':{
    factory:QuizScreen,
    isCommonAsset:true,
    sound:"background",
  },
  'r':{
    factory:QuizScreen,
    isCommonAsset:true,
    assetsIn:"p",
    sound:"background",
  },
  'f':{
    factory:FinalScreen,
    assetsIn:"v",
    assetPrefix:"v",
    sound:"fail",
  },
  'w':{
    factory:FinalScreen,
    assetsIn:"v",
    assetPrefix:"v",
    sound:"win",
  },
  'z':{
    factory:AchievementScreen,
    isCanvas:true,
    assetsIn:"v",
    assetPrefix:"v",
    sound:"win",
  },
};

export const prepareScreens = () => {
  for (var id in screens) {
    for (var setting in window.settings.screens[id]) {
      screens[id][setting] = window.settings.screens[id][setting];
    }
  }
}
