import settings from '../configuration/Settings'

class DataParser {

  parse(data) {

    console.log("Game data:",data);

    let getVariant=(v)=>{
      let disableFor=[];
      if (v.G) disableFor=v.G.split(",");
      let alterVariants = [];
      if (v.J) {
        let parser=v.J.split("\n");
        alterVariants=parser.reduce((a,v,i)=>{
          if (v) {
            let parserItem=v.split(";");
            let parseId = parserItem[0].split(",");
            a.push({
              id:parseId,
              text:parserItem[1],
              link:parserItem[2],
            });
          }
          return a;
        },[]);
      }

      let dateParse = v.I;
      let dateObj={};
      if (dateParse) {
        dateParse=v.I.split(",");
        dateObj=dateParse.reduce((o,v,i)=>{
          if (v.indexOf("m")>=0) {
            o.maxDate=Number(v.substr(1));
          } else
          if (v.indexOf(">")>=0) {
            o.minDate=Number(v.substr(1));
          } else {
            o.date=v;
          }
          return o;
        },{});
      }

      return {
        text:v.E,
        link:v.F,
        date:dateObj.date,
        maxDate:dateObj.maxDate,
        minDate:dateObj.minDate,
        action:v.H,
        alterVariants:alterVariants,
        disableFor:disableFor,
      }
    }

    let currentScreen = null;
    let screens = data.screens.schema.reduce((o,v,i)=>{
      if ((v)&&(v.D!=="c")) {
        if (v.A) {
          let alterText = {};
          if (v.K) {
            let parser=v.K.split("\n");
            alterText=parser.reduce((a,v,i)=>{
              if (v) {
                let parserItem=v.split(";");
                let parseId = parserItem[0].split(",");
                a.push({
                  id:parseId,
                  text:parserItem[1],
                });
              }
              return a;
            },[]);
          }
          let screen = {
            id:v.A,
            text:v.C,
            alterText:alterText,
            type:v.D,
            variants:[],
            location:v.L,
          };
          currentScreen = screen;

          if (v.E) {
            screen.variants.push(getVariant(v));
          }

          o.list.push(screen);
          o.index[screen.id]=screen;
        } else {
          if (v.E) {
            currentScreen.variants.push(getVariant(v));
          }
        }
      }
      return o;
    },{list:[],index:{}})

    let settings = {
    }

    let texts = {
      welcomeScreen:{
        title:data.screens.texts[0].B,
        text:data.screens.texts[1].B,
        button:data.screens.texts[2].B,
      }
    }

    let numeration = 0;

    let branches = {};

    let parseStream = (a,di,vi,start) => {

      let stream=[];
      let turn = 0;
      let isDialog = true;
      let phrase={};
      for (let i = start; i < a.length; i++) {
        if (isDialog) {
          phrase={};
          stream.push(phrase);
        }
        let dValue="";
        let vValue="";
        if (a[i]) {
          dValue=a[i][di];
          vValue=a[i][vi];
        }
        if (dValue) {

          let command="";
          let param="";

          let parseD=dValue.split("_");
          if (parseD.length>0) {
            dValue=parseD[parseD.length-1];
          }
          if (parseD.length===2) {
            dValue="";
            command=parseD[1];
          } else
          if (parseD.length>2) {
            command=parseD[1];
            param=parseD[2];
          }

          phrase.id=numeration++;
          phrase.turn=turn;
          phrase.text=dValue;
          phrase.command=command;
          phrase.param=param;

          turn=(turn===0)?1:0;
        } else {
          if (isDialog) {
            phrase.id=numeration++;
            phrase.turn=turn;
            phrase.text="";
            turn=(turn===0)?1:0;
          }
        }

        if (vValue) {
          let newDi=String.fromCharCode(vi.charCodeAt(0) + 1);
          let newVi=String.fromCharCode(newDi.charCodeAt(0) + 1);
          let branch=parseStream(a,newDi,newVi,i);
          if (!phrase.branches) {
            phrase.branches=[];
          }
          let branchId=numeration++;
          phrase.branches.push({
            text:vValue,
            branchId:branchId,
          });
          branches[branchId]=branch;
          isDialog=false;
        }

        if ((phrase.command==="end")||(phrase.command==="return")) {
          break;
        }
      }
      return stream;
    }

    let dialogs={list:[],index:{}};
    for (let dialogId in data.dialogs) {
      let v = data.dialogs[dialogId];
      let r = parseStream(v,"A","B",0);
      dialogs.list.push(r);
      dialogs.index[dialogId]=r;
    }

    let persons = data.screens.persons.reduce((o,v,i)=>{
      let person = {id:v.A,gender:v.B};
      o.index[v.A]=person;
      o.list.push(person);
      return o;
    },{list:[],index:{}})

    let femaleNames = data.screens.female_names.reduce((a,v,i)=>{
      if (v.A) a.push(v.A);
      return a;
    },[]);

    let maleNames = data.screens.male_names.reduce((a,v,i)=>{
      if (v.A) a.push(v.A);
      return a;
    },[]);

    let patrs = data.screens.patronymic.reduce((a,v,i)=>{
      if (v.A) a.push(v.A);
      return a;
    },[]);

    let surnames = data.screens.surnames.reduce((o,v,i)=>{
      if ((v.A)&&(v.A!="")) o.surnames.push(v.A);
      if ((v.B)&&(v.B!="")) o.words.push(v.B);
      if ((v.C)&&(v.C!="")) {
        o.ends.push(v.C);
        if (v.E) {
          for (var i = 1; i < v.E; i++) {
            o.ends.push(v.C);
          }
        }
      }
      if ((v.D)&&(v.D!="")) o.inflex.push({m:v.C,f:v.D});
      return o;
    },{surnames:[],words:[],ends:[],inflex:[]});

    let currentQuestion = {};
    let quiz = data.screens.quiz.reduce((a,v,i)=>{
      if (v.A) {
        currentQuestion={
          q:v.A,
          a:[],
        };
        a.push(currentQuestion);
      } else {
        if (v.B) {
          let answer = {
            text:"",
            note:v.D,
            results:[],
            mods:null,
            order:v.G,
          };
          if (v.E) {
            answer.results=v.E.split(",");
          }
          if (v.F) {
            answer.mods=v.F.split(",");
          }
          let texts=v.B.split(";");
          for (let ii = 0; ii < texts.length; ii++) {
            currentQuestion.a.push(
              {
                ...answer,
                text:texts[ii],
              }
            );
          }
        }
      }
      return a;
    },[]);
    let quizResults = data.screens.quiz_results.reduce((o,v,i)=>{
      if (v.A) {
        o[v.A]={
          id:v.A,
          text:v.B,
          code:v.C,
        }
      }
      return o;
    },{});



    let achievements = data.screens.achievements.reduce((o,v,i)=>{
      if (v.A) {
        o[v.A]={
          id:v.A,
          params:v.C?v.C.split(","):[],
          min:v.D,
          title:v.E,
          text:v.F,
        }
      }
      return o;
    },{});



    return {
      screens:screens,
      dialogs:dialogs,
      branches:branches,
      settings:settings,
      texts:texts,
      persons:persons,
      naming:{
        f:femaleNames,
        m:maleNames,
        patrs:patrs,
        surnames:surnames.surnames,
        words:surnames.words,
        ends:surnames.ends,
        inflex:surnames.inflex,
      },
      quiz:quiz,
      quizResults:quizResults,
      achievements:achievements,
    };

  }

}

export default DataParser;
