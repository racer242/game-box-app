import React from 'react';
import EventDispatcher from "../core/EventDispatcher";

class IconButton extends EventDispatcher {

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
    this.dispatchEvent("onClick",this.props.id);
  }

  render() {
    return (
      <img
        id={this.props.id}
        className={this.props.className}
        src={this.props.isEnabled?(this.props.isActive?this.props.iconStates[2]:(this.state.isHover?this.props.iconStates[1]:this.props.iconStates[0])):this.props.iconStates[3]}
        alt={this.props.title}
        title={this.props.title}
        style={{
          ...this.props.style,
          pointerEvents:(this.props.isEnabled&&!this.props.isActive)?"auto":"none",
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

export default IconButton;
