import settings from '../configuration/Settings'
import MobileDetect from 'mobile-detect'

export const callLater = (callback,delay = 100) => {
  return setTimeout(callback,delay);
}

export const getAssetId = (type,id) => {
  return type+id.replace(/\./ig,"_");
}

export const getScreenStuff = (screenSettings,screenState,assetsMod) => {


  if (screenSettings.isStatic) return {};

  let assetStore=screenSettings.assetsIn?screenSettings.assetsIn:screenState.type;

  let assetId="";
  if (screenSettings.isCommonAsset) {
    assetId=assetStore;
  } else {
    if (screenSettings.assetPrefix) {
      assetId=getAssetId(screenSettings.assetPrefix,screenState.id);
    } else {
      assetId=getAssetId(screenState.type,screenState.id);
    }
  }

  let manifestIndex="00";
  let assetModPath="";
  if (screenSettings.manifests[assetsMod]) {
    manifestIndex=assetsMod;
    assetModPath=assetsMod+"/";
  }
  let libModPath="";
  if (screenSettings.isModifiable) {
    libModPath=assetsMod+"/";
  }
  let sourceManifest=screenSettings.manifests[manifestIndex];
  let manifest=[];
  for (let i = 0; i < sourceManifest.length; i++) {
    let item=sourceManifest[i];
    manifest.push({
      id:item.id,
      src:settings.assetsUrl+assetStore+"/"+assetModPath+item.src,
    });
  }

  let path = settings.assetsUrl+assetStore+"/";

  let lib = screenSettings.lib;
  if (screenState.location) {
    lib = screenState.location;
  }

  return {
    lib:path+libModPath+lib,
    path:path,
    extraStuff:screenSettings.extraStuff,
    asset:assetId,
    manifest:manifest,
    sound:settings.soundsPath+screenSettings.sound,
  };
}

const getVariant = (variant,mod) => {
  if (variant.alterVariants.length>0) {
    for (let i = 0; i < variant.alterVariants.length; i++) {
      let alterVariant=variant.alterVariants[i];
      if (alterVariant.id.indexOf(mod)>=0) {
        return {
          text:alterVariant.text,
          link:alterVariant.link,
          disableFor:variant.disableFor,
        }
      }
    }
  }
  return variant;
}

const getVariants = (screenState,mod,date) => {
  return screenState.variants.reduce((a,v,i)=>{
    let variant = getVariant(v,mod);
    if ((variant.disableFor.indexOf(mod)<0)&&((!variant.maxDate)||(date<=variant.maxDate))) {
      a.push(variant);
    }
    return a;
  },[]);
}

const getScreenText = (screenState,mod) => {
  if (screenState.alterText.length>0) {
    for (let i = 0; i < screenState.alterText.length; i++) {
      let alterText=screenState.alterText[i];
      if (alterText.id.indexOf(mod)>=0) {
        return alterText.text;
      }
    }
  }
  return screenState.text;
}

export const getScreenState = (state,id) => {
  let screenState=state.screens.index[id];
  let result={
    ...screenState,
    variants:getVariants(screenState,state.mod,state.date),
    text:getScreenText(screenState,state.mod),
  }
  return result;
}


export const getPatrMethods = {
  m:(s) => {
    return s;
  },
  f:(s) => {
    return s.replace("вич","вна").replace("тич","тишна").replace("ич","инична");
  }
}

export const getSurnameMethods = {
  m:(s,inflex) => {
    return s;
  },
  f:(s,inflex) => {
    for (var i = 0; i < inflex.length; i++) {
      let srch = inflex[i].m;
      let index = s.lastIndexOf(srch);
      if (index===s.length-srch.length) {
        return s.substr(0,index)+inflex[i].f;
      }
    }
    return s;
  }
}

export const generateSurnameMethods=[
  (naming,gender)=>{
    return naming.surnames[Math.floor(naming.surnames.length*Math.random())];
  },
  (naming,gender)=>{
    let name=naming.m[Math.floor(naming.m.length*Math.random())];
    let end=naming.ends[Math.floor(naming.ends.length*Math.random())];
    return name.replace(/ий$/,"").replace(/ей$/,"").replace(/ия$/,"")+end;
  },
  (naming,gender)=>{
    let name=naming.f[Math.floor(naming.f.length*Math.random())];
    let end=naming.ends[Math.floor(naming.ends.length*Math.random())];
    return name.replace(/ия$/,"").replace(/я$/,"").replace(/а$/,"")+end;
  },
  (naming,gender)=>{
    let surname=naming.surnames[Math.floor(naming.surnames.length*Math.random())];
    let end=naming.ends[Math.floor(naming.ends.length*Math.random())];
    for (var i = 0; i < naming.ends.length; i++) {
      let srch = naming.ends[i];
      let index = surname.lastIndexOf(srch);
      if (index===surname.length-srch.length) {
        return surname.substr(0,index)+end;
      }
    }
    return surname+end;
  },
  (naming,gender)=>{
    let word=naming.words[Math.floor(naming.words.length*Math.random())];
    let end=naming.ends[Math.floor(naming.ends.length*Math.random())];
    let result="";
    word=word.replace(/[ьуеыаоэяиюй]$/,"").replace(/ое$/,"").replace(/ая$/,"").replace(/ие$/,"").replace(/ое$/,"");
    if ((String("уеёыаоэяию").indexOf(end.substr(0,1))==-1)&&
        (String("уеёыаоэяию").indexOf(end.substr(1,1))==-1)) {
        word=word.replace(/[йцкнгшщзхфвпрлджчсмтб]$/,"");
    }
    return word+end;
  },
];



export const getSurname = (naming,gender) => {
  let surname=generateSurnameMethods[Math.floor(generateSurnameMethods.length*Math.random())](naming,gender);
  return getSurnameMethods[gender](surname,naming.inflex);
}

export const getFullName = (state,mod,gen) => {
  let gender=(gen)?gen:state.persons.index[mod].gender;
  let names=state.naming[gender];
  let patr=state.naming.patrs[Math.floor(state.naming.patrs.length*Math.random())];
  return {
    name:names[Math.floor(names.length*Math.random())],
    patr:getPatrMethods[gender](patr),
    surname:getSurname(state.naming,gender),
  }
}

const localStoreName = "PPN_2018_02"

export const setDataToLocalStorage = (data) => {
  let storageJson = window.localStorage.getItem(localStoreName);
  if (storageJson) {
    storageJson=JSON.parse(storageJson);
  } else {
    storageJson={};
  }
  for (let id in data) {
    storageJson[id]=data[id];
  }
  storageJson=JSON.stringify(storageJson);
  window.localStorage.setItem(localStoreName,storageJson);
}

export const getDataFromLocalStorage = (id) => {
  let storageJson = window.localStorage.getItem(localStoreName);
  if (storageJson) {
    storageJson=JSON.parse(storageJson);
    return storageJson[id];
  }
  return null;
}

export const isMobile = () => {
  var mobileDetect = new MobileDetect(window.navigator.userAgent);
  return mobileDetect.mobile();
}
