class DrumKit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      displayText: 'DrumKit',
      styleBg: false
    }
    this.makeChange = this.makeChange.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.soundChange = this.soundChange.bind(this);
    this.colorChange = this.colorChange.bind(this);
  }
  componentDidMount() {
    document.addEventListener('keydown', this.keyPress);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.keyPress);
  }
  colorChange = (i) => { 
    var elem = document.getElementById(sounds[i].id);
    if (this.state.styleBg) {
      elem.style.background = '#f4845f';
      elem.style.borderTop = '2px solid grey';
      elem.style.borderLeft = '2px solid grey';
      elem.style.borderRight = '2px solid white';
      elem.style.borderBottom = '2px solid white';
      this.setState({
        styleBg: false
      }) 
    } else {
      elem.style.background = '';
      elem.style.borderTop = '';
      elem.style.borderLeft = '';
      elem.style.borderBottom = '';
      elem.style.borderRight = '';
    }
  }
  soundChange = (x, index) => {
    x.currentTime = 0;
    x.play();
    this.setState({
      displayText: sounds[index].id,
      styleBg: true
    });
  }
  keyPress = (e) => {
    for (let i=0; i<sounds.length; i++) {
      if (e.key === sounds[i].keys.toLowerCase() || e.key === sounds[i].keys) {
        let clip = document.getElementById(sounds[i].keys);
        this.soundChange(clip, i);
        this.colorChange(i);
        setTimeout(() => this.colorChange(i), 100);
      }
    }
  }
  makeChange = (e) => {
    for (let i=0; i<sounds.length; i++) {
      if (e.target.id === sounds[i].id) {
        let clip = document.getElementById(sounds[i].keys);
        this.soundChange(clip, i);
      }
    }
  }
  render() {
    return (
      <div className="main-div">
        <div id="display">{this.state.displayText}</div>
        <div className="container">
         { sounds.map((x) => ( 
    <button className="drum-pad" id={x.id} onKeyPress={this.keyPress} onClick={this.makeChange}>{x.keys}<audio className="clip" id={x.keys} src={x.url}/></button>
  )) }
        </div>
      </div>
    )
  }
}

const sounds = [{
  keys: 'Q',
  keyCodes: 81,
  id: 'Heater_1',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
},{
  keys: 'W',
  keyCodes: 87,
  id: 'Heater_2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
},{
  keys: 'E',
  keyCodes: 69,
  id: 'Heater_3',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
},{
  keys: 'A',
  keyCodes: 65,
  id: 'Heater_4',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
},{
  keys: 'S',
  keyCodes: 83,
  id: 'Heater_5',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
},{
  keys: 'D',
  keyCodes: 68,
  id: 'Dsc_Oh',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
},{
  keys: 'Z',
  keyCodes: 90,
  id: 'Kick_n_Hat',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
},{
  keys: 'X',
  keyCodes: 88,
  id: 'RP4_Kick',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
},{
  keys: 'C',
  keyCodes: 67,
  id: 'Cev_H2',
  url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
}]


ReactDOM.render(<DrumKit/>, document.getElementById('drum-machine'))