import React from 'react';
import EventDispatcher from "../core/EventDispatcher";

import SoundOffButton from "../images/misc/sound_off_button.svg";
import SoundOnButton from "../images/misc/sound_on_button.svg";

class SoundButton extends EventDispatcher {

  constructor(props) {
    super(props);
    this.state = {
      isHover:false
    };

    this.mouseOverHandler=this.mouseOverHandler.bind(this);
    this.mouseOutHandler=this.mouseOutHandler.bind(this);
    this.clickHandler=this.clickHandler.bind(this);

  }

  mouseOverHandler () {
    this.setState({
      ...this.state,
      isHover:true
    });
  }
  mouseOutHandler () {
    this.setState({
      ...this.state,
      isHover:false
    });
  }

  clickHandler() {
    this.dispatchEvent("onClick");
  }

  render() {
    return (
      <img
        id={this.props.id}
        className={((this.state.isHover)?"sound-button hover":"sound-button")}
        src={(this.props.volume===0)?SoundOffButton:SoundOnButton}
        style={{
          ...this.props.style,
          pointerEvents:(this.props.isEnabled&&!this.props.isActive)?"auto":"none",
          cursor:(this.props.isEnabled&&!this.props.isActive)?"pointer":"default",
          visibility:(this.props.isVisible===false)?"hidden":"visible",
          display:(this.props.isIncluded===false)?"none":"block",
        }}
        onMouseOver={this.mouseOverHandler}
        onMouseOut={this.mouseOutHandler}
        onClick={this.clickHandler}
        />
    );
  }
}

export default SoundButton;
