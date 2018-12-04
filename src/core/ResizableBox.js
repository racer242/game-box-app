import EventDispatcher from '../core/EventDispatcher';

class ResizableBox extends EventDispatcher {

  constructor(props) {
    super(props);
    this.state = {};
    this.styles={
      width:"100px",
      height:"100px",
      left:"0px",
      top:"0px"
    };
  }

  setStyles(source) {
    this.styles={
      width:source.width+"px",
      height:source.height+"px",
      left:source.left+"px",
      top:source.top+"px"
    };
    if ((source.width===0)||(source.height===0)) {
      this.styles.visibility="hidden";
    } else {
      this.styles.visibility="visible";
    }
  }

  componentWillMount() {
    this.setStyles(this.props);
  }

  componentWillUpdate(nextProps, nextState) {
    this.setStyles(nextProps);
  }

}

export default ResizableBox;
