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
  id: 'Drum1',
  url: 'http://www.sounds.beachware.com/2illionzayp3may/wlyjbzzu/BASEDRM2.mp3'
},{
  keys: 'W',
  keyCodes: 87,
  id: 'Drum2',
  url: 'http://www.sounds.beachware.com/2illionzayp3may/opaz/THUD.mp3'
},{
  keys: 'E',
  keyCodes: 69,
  id: 'Drum3',
  url: 'http://vincentbernay.free.fr/free-percussions-loops/Conga1.mp3'
},{
  keys: 'A',
  keyCodes: 65,
  id: 'Snare1',
  url: 'http://dight310.byu.edu/media/audio/FreeLoops.com/3/3/Free%20Drum%20Snare%2019-993-Free-Loops.com.mp3'
},{
  keys: 'S',
  keyCodes: 83,
  id: 'Snare2',
  url: 'http://dight310.byu.edu/media/audio/FreeLoops.com/3/3/Free%20Drum%20Snare%2014-978-Free-Loops.com.mp3'
},{
  keys: 'D',
  keyCodes: 68,
  id: 'Snare3',
  url: 'http://dight310.byu.edu/media/audio/FreeLoops.com/3/3/Free%20Drum%20Snare%202-942-Free-Loops.com.mp3'
},{
  keys: 'Z',
  keyCodes: 90,
  id: 'Clap',
  url: 'http://dight310.byu.edu/media/audio/FreeLoops.com/5/5/Lil%20John%20Crunk%20Clap3-2136-Free-Loops.com.mp3'
},{
  keys: 'X',
  keyCodes: 88,
  id: 'Kick',
  url: 'http://dight310.byu.edu/media/audio/FreeLoops.com/1/1/BeatBox%20Kick%20Sound-21504-Free-Loops.com.mp3'
},{
  keys: 'C',
  keyCodes: 67,
  id: 'Moog',
  url: 'http://s1download-universal-soundbank.com/mp3/sounds/20239.mp3'
}]


ReactDOM.render(<DrumKit/>, document.getElementById('drum-machine'))