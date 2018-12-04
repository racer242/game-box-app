import React from 'react';

import { getDataFromLocalStorage, isMobile } from '../core/helpers';


let geometry = {
    nominalWidth:700,
    nominalHeight:700,

    lowWidth:576,
    lowHeight:576,

    fullWidth:1920,
    fullHeight:1920,

    minWidth:90,
    minHeight:90,

    maxWidth:3640,
    maxHeight:3640,

    offsetX:0,
    offsetY:0,

    nominalRootFontSize:10,

    quality:"full",

    iScreen:{
      selectionPartL:0.4,
      selectionPartP:0.5,
      margin:0.03,
      gap:0,
      itemMaxSize:4.2,
    }

}

geometry.qualityScaleMap = {
  full:geometry.nominalWidth/geometry.fullWidth,
  low:geometry.nominalWidth/geometry.lowWidth
}


geometry.hdScale=geometry.qualityScaleMap[geometry.quality];

let parseArr = window.location.href.split("?");
let urlParams = (parseArr.length>1)?parseArr[1].split("&"):[];
urlParams=urlParams.reduce((o,v,i)=>{
  let p=v.split("=");
  o[p[0]]=p[1];
  return o;
},{});

let firstScreen="0.1";
if (urlParams["s"]) {
  firstScreen=urlParams["s"];
}

let modId="01";
if (urlParams["m"]) {
  modId=urlParams["m"];
}

let volume=getDataFromLocalStorage("volume");
if (volume==null) volume=1;
if (isMobile()) volume=0;

const settings = {

  ...geometry,

  store:{ },
  localStoreName:"appState_09041801",

  developerTitle:"mediasmit.ru",
  developerUrl:"http://www.mediasmit.ru/",
  developerHead:null,
  developerTexts:[
    "Мы создаем digital-продукты, направленные на решение бизнес-задач клиентов",
    "mediasmit.ru",
  ],

  baseUrl:".",

  assetsUrl : process.env.PUBLIC_URL+'/assets/',
  soundsPath : process.env.PUBLIC_URL+'/sound/',
  pdfPath : process.env.PUBLIC_URL+'/pdf/',
  screensXlsxSrc:process.env.PUBLIC_URL+'/xlsx/Screens_PPN2018.xlsx',
  dialogsXlsxSrc:process.env.PUBLIC_URL+'/xlsx/Dialogues_PPN2018.xlsx',

  firstScreen:firstScreen,
  successScreen:"5.1",
  failScreen:"4.1",
  failDate:30,

  soundVolume: {
    main:0.3,
    background:0.2,
    fail:0.3,
    win:0.3,
  },

  codeDialogScreen:"1.7",
  codeVariantNum:3,

  dialog:{
    defaultDelay:1000,
    minDelay:1000,
    wordDuration:300,
  },


  defaultState:{
    mod:modId,
    codeWord:"КОДОВОЕ СЛОВО",
    date:1,
    fullName:{
      name:"",
      patr:"",
      surname:"",
    },
    achievementsData:{},
    achievementsResult:{},
    volume:volume,
  },

  revolver:{
    speed:4,
    impulse:3,
    maxSpeed:10,
    dispersion:2,
    slowdown:.04,
    finishing:.3,
  },

  miniGame:{
    bgSpeedScale:0.4,
    speed:[0,8,14,20,0],
    acceleration:[0,1,1.5,1,-.7],
    phaseChange:[1,3,100000,0,0],
    mobCreation:{
      freq:140,
      disp:20,
    },
    immortalDelay:80,
    startDistance:800,
    finishDistance:30000,
    gameOverDeceleration:-1,
  },

  quizExtraPersonIds:{f5:true,m5:true},

  texts : {
    initScreen:{
      title:"Инициализация",
      text:"Приложение инициализируется",
    },
    loaderScreen:{
      title:"Загрузка",
      text:"Загружаются компоненты, подождите минутку",
    },
  },

  errorTexts:{
    errorTitle:"Ошибка",
    warningTitle:"Предупреждение",
    templateErrorTitle:"Ошибка шаблона",
    closeWindowsError:"Данная версия браузера не позволяет закрывать окно из кода сценария. Закройте окно самостоятельно.",
  },

}


export default settings;
