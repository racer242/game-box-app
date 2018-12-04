import React from 'react';
import settings from '../configuration/Settings';

import { callLater, isMobile } from '../core/helpers';

import { setStoreData } from '../actions/appActions'

import ServiceScreen from './ServiceScreen';

import CanvasLoader from '../components/CanvasLoader';

class MiniGameScreen extends ServiceScreen {

  constructor(props) {
    super(props);

    this.tickHandler = this.tickHandler.bind(this);
    this.service_completeHandler = this.service_completeHandler.bind(this);
    this.frame_completeHandler = this.frame_completeHandler.bind(this);

    this.phases={
      list:["stay","go","run","jump","fall"],
      index:{"stay":0,"go":1,"run":2,"jump":3,"fall":4},
    };

    this.phase=0;

  }

  interactionHandler(data) {
    // console.log("interactionHandler");
    switch (data.source) {
      case "phase": {
        this.processPhase(data);
        break;
      }
      case "jumpButton": {
        if (this.phase!==4) {
          this.setPhase(3);
        }
        break;
      }
      case "restartButton": {
        this.startGame();
        break;
      }
      case "b0": {
        this.destroyGame();
        super.interactionHandler(data);
        break;
      }
      default:

    }
  }

  activateHandler(data) {
    switch (data.step) {
      case 0: {
        this.initGame(data);
        break;
      }
      default:

    }
// let canvasProps = this.canvas.getCanvasProps();
  }

  tickHandler(event) {
    let acceleration=settings.miniGame.acceleration[this.phase];
    let speedLimit=settings.miniGame.speed[this.phase];

    if (this.gameOver) {
      speedLimit=0;
      acceleration=settings.miniGame.gameOverDeceleration;
      this.phaseTurn=0;
    }

    this.speed+=acceleration;
    if (acceleration>=0) {
      if (this.speed>speedLimit) {
        this.speed=speedLimit;
      }
    } else {
      if (this.speed<speedLimit) {
        this.speed=speedLimit;
      }
    }

    this.updateBackground();
    this.updateMobs();
    this.updatePlayer();
    this.updateDistance();

  }

  initGame(data) {
    console.log("initGame");
    this.player=data.player.mob;
    this.playerArea=data.player.area;
    this.bg=data.bg01;
    {
      let mx = this.bg.layer.marker.x;
      let my = this.bg.layer.marker.y;
      this.bg.layer.cache(0,0,mx,my,true);
      this.bg.snapToPixel=true;
    }

    this.back=data.back;
    {
      let mx = this.back.marker.x;
      let my = this.back.marker.y;
      this.back.cache(0,0,mx,my,true);
      this.back.snapToPixel=true;
    }


    this.mobsSource=data.mobs;

    this.mobCreationPlace=settings.nominalWidth*1.5;
    this.mobDeathPlace=-settings.nominalWidth*.5;
    this.bgMaxPosition=this.bg.duration;

    this.gameOverPlace=settings.nominalWidth*.8;

    this.jumpButton=data.jumpButton;
    this.restartButton=data.restartButton;

    this.start=data.start;
    this.start.visible=false;
    {
      let mx1 = this.start.marker1.x;
      let my1 = this.start.marker1.y;
      let mx2 = this.start.marker2.x;
      let my2 = this.start.marker2.y;
      this.start.cache(mx1,my1,mx2-mx1,my2-my1,true);
      this.start.snapToPixel=true;
    }



    this.finish=data.finish;
    this.finish.visible=false;
    {
      let mx1 = this.finish.marker1.x;
      let my1 = this.finish.marker1.y;
      let mx2 = this.finish.marker2.x;
      let my2 = this.finish.marker2.y;
      this.finish.cache(mx1,my1,mx2-mx1,my2-my1,true);
      this.finish.snapToPixel=true;
    }

    this.lifesSource=data.lifes;

    this.successFinish=data.successFinish;
    this.successFinish.visible=false;
		this.failFinish=data.failFinish;
    this.failFinish.visible=false;

    if (!this.tickListener) {
      this.tickListener=window.createjs.Ticker.addEventListener("tick", this.tickHandler);
    }


    let canvas=this.refs.FrameCanvasLoader;
    if (canvas) {
      let canvasProps = canvas.getCanvasProps();
      if (canvasProps.root) {
        canvasProps.root.cache(-500,-500,1700,1700,true);
      }
    }

    this.startGame();
  }

  startGame() {


    this.speed=0;
    this.phaseTurn=0;
    this.bgPosition=0;
    this.nextMobCreationTurn=this.getNextMobCreationTurn();
    this.immortalTurn=0;
    this.lastMotionPhase=0;
    this.mobCreationTurn=0;

    this.start.visible=true;
    this.start.x=settings.nominalWidth*.5;
    this.finish.visible=false;
    this.finish.x=settings.nominalWidth*2;

    this.distance=0;
    this.gameOver=false;
    this.gameIsFinishing=false;

    this.jumpButton.visible=true;
    this.restartButton.visible=false;

    this.lifes=[];

    for (var i = 0; i < this.lifesSource.length; i++) {
      this.lifesSource[i].visible=true;
      this.lifes.push(this.lifesSource[i]);
    }

    this.activeMobs={};

    this.mobs=this.mobsSource.reduce((a,v,i)=>{
      v.mob.visible=false;
      a.push(
        {
          ...v,
          id:i,
        }
      );
      return a;
    },[]);

    this.successFinish.visible=false;
	  this.failFinish.visible=false;

    this.setPhase(0);
    this.tickHandler();

  }

  finishGame(success) {
    this.gameOver=true;
    this.jumpButton.visible=false;
    this.restartButton.visible=true;
    if (success) {
      this.successFinish.visible=true;
      this.successFinish.gotoAndPlay(0);
    } else {
      this.failFinish.visible=true;
      this.failFinish.gotoAndPlay(0);
    }
  }

  setPhase(index) {
    // console.log("setPhase",index);
    this.phaseTurn=0;
    this.phase=index;
    let phaseId=this.phases.list[index];
    this.player.gotoAndStop(phaseId);
    if (this.phase<=2) this.lastMotionPhase=this.phase;
  }

  processPhase(data) {
    // console.log("processPhase",data.id);
    this.phaseTurn++;
    if (this.phaseTurn>settings.miniGame.phaseChange[this.phase]) {
      switch (this.phase) {
        case 0:
          this.setPhase(1);
        break;
        case 1:
          this.setPhase(2);
        break;
        case 2:
          this.setPhase(2);
        break;
        case 3:
          this.setPhase(2);//this.lastMotionPhase
        break;
        case 4:
          if (!this.gameOver) {
            this.immortalTurn=settings.miniGame.immortalDelay;
          }
          this.setPhase(0);
        break;
        default:
      }
    }
  }

  getNextMobCreationTurn() {
    return Math.round(settings.miniGame.mobCreation.freq+(Math.random()*2-1)*settings.miniGame.mobCreation.disp);
  }

  createMob() {
    // console.log("createMob?",this.mobs.length);
    if (this.mobs.length>0) {
      let index=Math.floor(Math.random()*this.mobs.length);
      let mob=this.mobs.splice(index,1)[0];
      this.activeMobs[mob.id]=mob;
      mob.mob.visible=true;
      mob.mob.x=this.mobCreationPlace;

      // console.log("createMob",mob.id);
    }
  }

  removeMob(id) {
    // console.log("removeMob",id);
    let mob=this.activeMobs[id];
    delete this.activeMobs[id];
    this.mobs.push(mob);
    mob.mob.visible=false;
  }

  updateMobs() {
    this.mobCreationTurn++;

    if ((this.mobCreationTurn>this.nextMobCreationTurn)&&(!this.gameIsFinishing)&&(!this.gameOver)) {
      this.nextMobCreationTurn=this.getNextMobCreationTurn();
      this.mobCreationTurn=0;
      this.createMob();
    }

    for (var mobId in this.activeMobs) {
      let mob=this.activeMobs[mobId];
      mob.mob.x-=this.speed+(mob.speed?mob.speed:0);

      if (
        (!this.gameOver)&&
        (this.phase<3)&&
        (this.immortalTurn===0)&&
        (
          ((this.player.x+this.playerArea>mob.mob.x-mob.area)&&
          (this.player.x+this.playerArea<mob.mob.x+mob.area))||
          ((this.player.x-this.playerArea>mob.mob.x-mob.area)&&
          (this.player.x-this.playerArea<mob.mob.x+mob.area))
        )
      ) {
        this.setPhase(4);
        this.loseLife();
      }

      if (mob.mob.x<this.mobDeathPlace) {
        this.removeMob(mobId);
      }
    }
  }

  updatePlayer() {
    if (this.immortalTurn>0) {
      this.immortalTurn--;
      this.player.alpha=Math.sin(this.immortalTurn)*0.5+0.5;
      if (this.immortalTurn<=0 ) {
       this.immortalTurn=0;
       this.player.alpha=1;
     }
    }
  }

  updateBackground() {
    this.bgPosition+=this.speed*settings.miniGame.bgSpeedScale;
    if (this.bgPosition>=this.bgMaxPosition) this.bgPosition=0;
    this.bg.gotoAndStop(Math.floor(this.bgPosition));
  }


  updateDistance() {
    if (this.distance<settings.miniGame.startDistance) {
      this.distance+=this.speed;
      if (this.distance>settings.miniGame.startDistance) {
        this.start.visible=false;
      } else {
        this.start.x-=this.speed;
      }
    } else
    if (this.distance>settings.miniGame.finishDistance) {
      this.distance+=this.speed;
      this.finish.visible=true;
      this.finish.x-=this.speed;
      this.gameIsFinishing=true;
      if ((!this.gameOver)&&(this.finish.x<this.gameOverPlace)) {
        this.finishGame(true);
        this.setPhase(0);
      }
    } else {
      this.distance+=this.speed;
    }
  }

  loseLife() {
    if (this.lifes.length>0) {
      let life=this.lifes.pop();
      life.visible=false;
      if (this.lifes.length===0) {
        this.finishGame(false);
      }
    }
  }




  destroyGame() {
    window.createjs.Ticker.removeEventListener("tick", this.tickHandler);
    this.tickListener=null;
    this.player=null;
    this.bg=null;
    this.mobs=null;
  }

  checkLoadComplete() {
    if (this.serviceLoaded&&this.frameLoaded) {
      this.canvas_completeHandler();
    }
  }

  service_completeHandler(data) {
    this.serviceLoaded=true;
    this.checkLoadComplete();
  }

  frame_completeHandler(data) {
    this.frameLoaded=true;
    this.checkLoadComplete();
  }


  render() {
    return (
      <div
          className="screen service-screen"
          style={{
            ...this.styles
          }}
        >
        <CanvasLoader

          ref="ServiceCanvasLoader"

          id="Service"

          snapToPixel={true}

          left={this.props.left}
          top={this.props.top}

          width={this.props.width}
          height={this.props.height}

          manifest={this.props.manifest}
          libSource={this.props.libSource}
          asset={this.props.asset}

          onComplete={this.service_completeHandler}
          onInteraction={this.interactionHandler}
          onActivate={this.activateHandler}
        />

        <CanvasLoader

          id="Frame"

          ref="FrameCanvasLoader"

          isTransparent={true}

          snapToPixel={true}

          left={this.props.left}
          top={this.props.top}

          width={this.props.width}
          height={this.props.height}

          manifest={this.props.manifest}
          libSource={this.props.path+this.props.extraStuff.lib}
          asset={this.props.extraStuff.assetPrefix+this.props.state.mod}

          onComplete={this.frame_completeHandler}
        />

      </div>
    );
  }


}

export default MiniGameScreen;
