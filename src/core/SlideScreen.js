import Screen from './Screen';

class SlideScreen extends Screen {

  constructor(props) {
    super(props);
  }

  dispatchSlideEvent(data) {
    this.dispatchEvent("onAction",{...data,action:"slide"});
  }

}

export default SlideScreen;
