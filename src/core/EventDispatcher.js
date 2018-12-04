import { Component } from 'react';

class EventDispatcher extends Component {

  dispatchEvent(eventType,data) {
    this.props[eventType](data);
  }

}

export default EventDispatcher;
