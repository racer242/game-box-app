import EventDispatcher from '../core/EventDispatcher';

import { callLater } from './helpers';

import Dispatcher from './Dispatcher';
import settings from '../configuration/Settings';

import DataParser from './DataParser';

import preloader from 'preloader';

// import spreadsheet from '../xlsx/configuration.xlsx'

import XLSX from 'xlsx';

// import configuration from '../xlsx/configuration.xlsx';
// getXlsxConfig(callback) {
//   callback(this.convertSheetsToTables(spreadsheet.Sheets));
// }
// if ((window.settings)&&(window.settings.useEmbeddedContent)&&(window.template)) {
//   console.log("Extracting embedded content");
//   callLater(()=>{
//     let wb = XLSX.read(window.template, {type: 'base64'});
//     this.setState(
//       {
//         ...this.state,
//         template:this.convertSheetsToTables(wb.Sheets),
//       }
//     );
//   },1000);
//   return;
// }

class DataManager extends EventDispatcher {

  constructor(props) {
    super(props);
    this.state = {
      screens:null,
      dialogs:null,
      imagesAreLoading:false,
      imagesLoaded:false,
    }
    this.loader=null;
    this.completed=false;
    this.result=null;
  }

/* ++++ React methods ++++ */

  componentDidMount() {
    Dispatcher.subscribe("onAppLoad",this);
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.completed) return;
    this.checkComplete(this.state);
  }

/* ++++ Own methods ++++ */

/*  Загрузка xlsx */

  loadXlsx(url,callback) {

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";
    oReq.onload = (e) => {
      var arraybuffer = oReq.response;
      var data = arraybuffer;
      var wb;
      var arr = this.fixXlsx(data);
      var btoaValue=btoa(arr);

      if (window.settings.outTemplateToConsole) {//!!!
        console.log("TEMPLATE XLSX COPY:");
        console.log("-----------------------------------------------------------");
        console.log("window.template=\""+btoaValue+"\"");
        console.log("-----------------------------------------------------------");
      }

      wb = XLSX.read(btoaValue, {type: 'base64'});
      callback(this.convertSheetsToTables(wb.Sheets));
    }
    oReq.send();

  }

  fixXlsx(data) {
    let o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
  }

  convertSheetsToTables(data) {
    let result={};
    for (let id in data) {
      let rows=[];
      result[id]=rows;
      let cells=data[id];
      for (let cellId in cells) {
        let y=cellId.substr(1)-1;
        let x=cellId.substr(0,1);//cellId.charCodeAt(0)-("A").charCodeAt(0);
        if (rows[y]==null) {
          rows[y]=[]
        }
        rows[y][x]=cells[cellId].v;
      }
      rows.splice(0,1);
    }
    return result;
  }

/*  Загрузка json */

  loadJSON(url,callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = (e) => {
      console.log("XMLHttpRequest:",xobj.readyState,xobj.status);
      if ((xobj.readyState === 4) && (xobj.status === 200)) {
        if (xobj.responseText.substr(0,1)!=="<") {
          callback(xobj.responseText);
          console.log("JSON load complete:",url);
        } else {
          console.log("JSON load error:",url);
          callback(null);
        }
      } else {
        let isError=false;
        if (xobj.readyState === 0) isError=true;
        if ((xobj.readyState === 4)&&(xobj.status===0)) isError=true;
        if (xobj.status >= 400) isError=true;
        if (isError)
        {
          console.log("JSON load error:",url);
          callback(null);
        }
      }
    };
    xobj.send(null);
  }

/*  Preload images */

  getManifest(data) {
    let manifest=[];

    // manifest.push(settings.developerIconUrl);
    // manifest.push(settings.welcomeScreenBg());
    console.log("Manifest:",manifest);
    return manifest;
  }

  preloadImages(manifest) {

    if (manifest.length>0) {

      this.setState(
        {
          ...this.state,
          imagesAreLoading:true,
        }
      )
      this.loader=new preloader( {
        xhrImages: false,
      });
      this.loader.on('complete',() => {
        console.log("Preload complete");
        this.setState(
          {
            ...this.state,
            imagesLoaded:true,
          }
        )
      });
      manifest.forEach((v,i)=>{
        if ((v)&&(v!=="")&&(v.length>6)) {
          this.loader.addImage(v);
        }
      });

      this.loader.load();

    } else {
      this.setState(
        {
          ...this.state,
          imagesAreLoading:true,
          imagesLoaded:true,
        }
      )
    }

  }


/*  Load checking */

  checkComplete(checkingData) {
    if (
      (checkingData.screens)&&
      (checkingData.dialogs)
    ) {
      if (!checkingData.imagesAreLoading) {
        let dataParser=new DataParser();
        this.result=dataParser.parse(checkingData);
        this.preloadImages(this.getManifest(this.result));
      } else
      if (checkingData.imagesLoaded)
      {
        console.log("Data loaded");
        this.completed=true;
        this.dispatchEvent("onComplete",this.result);

        callLater(()=>{ //Dispose
          this.setState(
            {
            }
          );
        },1000);

      }
    }
  }


/*  Загрузка данных */

  load() {
    this.completed=false;
    this.loadScreens();
    this.loadDialogs();
  }

  loadScreens() {
    this.loadXlsx(settings.screensXlsxSrc,(data)=>{
      this.setState(
        {
          ...this.state,
          screens:data
        }
      );
      console.log("Screens data:",data);
    });
  }

  loadDialogs() {
    this.loadXlsx(settings.dialogsXlsxSrc,(data)=>{
      console.log("Dialogs data:",data);
      this.setState(
        {
          ...this.state,
          dialogs:data
        }
      );
    });
  }


  /* ++++ Dispatcher event handlers ++++ */

  onAppLoad() {
    this.load();
  }

  /* ++++ RENDER ++++ */

  render () {
    return null;
  }

}
export default DataManager;
