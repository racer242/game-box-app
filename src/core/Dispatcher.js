import { List, Map } from 'immutable';

var _GLOBAL_DISPATCHER_ = null;

class Dispatcher {

  static get i() {
    if (!_GLOBAL_DISPATCHER_) {
      _GLOBAL_DISPATCHER_=new Dispatcher();
    }
    return _GLOBAL_DISPATCHER_;
  }

  constructor() {
    console.log("Create dispatcher ");
    _GLOBAL_DISPATCHER_=this;
    this.eventTypes = new Map();
  }

  static subscribe(eventType,listeter) {
    let v = Dispatcher.i.eventTypes.get(eventType);
    if (v) {
      v=v.push(listeter);
      Dispatcher.i.eventTypes=Dispatcher.i.eventTypes.set(eventType,v);
    } else {
      Dispatcher.i.eventTypes=Dispatcher.i.eventTypes.set(eventType,new List([listeter]));
    }
  }

  static unsubscribe(eventType,listeter) {
    let v = Dispatcher.i.eventTypes.get(eventType);
    if (v) {
      let i=v.indexOf(listeter);
      if (i>=0) {
        v=v.delete(i);
        Dispatcher.i.eventTypes=Dispatcher.i.eventTypes.set(eventType,v);
      }
    }
  }

  static dispatch(eventType,...data) {
    let v = Dispatcher.i.eventTypes.get(eventType);
    if (v) {
      v.forEach((value,key,iterator) => {
        value[eventType].apply(value,data);
      });
    }
  }

}

export default Dispatcher;
