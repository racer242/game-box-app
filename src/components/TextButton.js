import React from 'react';
import EventDispatcher from "../core/EventDispatcher";

class TextButton extends EventDispatcher {

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
      <div
        id={this.props.id}
        className={(this.props.isEnabled!==false)?this.props.className:this.props.disabledClassName}
        dangerouslySetInnerHTML={{__html:this.props.text}}
        style={{
          ...this.props.style,
          pointerEvents:((this.props.isEnabled!==false)&&(!this.props.isActive))?"auto":"none",
          visibility:(this.props.isVisible===false)?"hidden":"visible",
        }}

        onMouseOver={this.mouseOverHandler}
        onMouseOut={this.mouseOutHandler}
        onClick={this.clickHandler}
        />
    );
  }
}

export default TextButton;
