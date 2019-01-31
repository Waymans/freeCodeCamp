class ClockWork extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      length: 25,
      second: 0,
      break: false,
      display: 'Session',
      control: 'Start'
    }
    this.startStop = this.startStop.bind(this);
    this.reset = this.reset.bind(this);
    this.timer = this.timer.bind(this);
    this.brkCounter = this.brkCounter.bind(this);
    this.sesCounter = this.sesCounter.bind(this);
    this.clock = this.clock.bind(this);
    this.interval = this.interval.bind(this);
  }
  brkCounter(e){
    if (this.state.control === 'Start') {
      if (e.target.innerHTML === '+') {
        if (this.state.breakLength <= 59) {
          this.setState({
            breakLength: this.state.breakLength +1,
          });
          if (this.state.break === true) {
            this.setState({
              length: this.state.breakLength -1,
            });
          }
        }
      } else {
        if (this.state.breakLength > 1) {
          this.setState({
            breakLength: this.state.breakLength -1,
          });
          if (this.state.break === true) {
            this.setState({
              length: this.state.breakLength -1,
            });
          }
        }
      }
    }
  }
  sesCounter(e){
    if (this.state.control === 'Start') {
      if (e.target.innerHTML === '+') {
        if (this.state.sessionLength <= 59) {
          this.setState({
            sessionLength: this.state.sessionLength +1,
          });
          if (this.state.break === false) {
            this.setState({
              length: this.state.sessionLength +1,
            });
          }
        }
      } else {
        if (this.state.sessionLength > 1) {
          this.setState({
            sessionLength: this.state.sessionLength -1,
          });
          if (this.state.break === false) {
            this.setState({
              length: this.state.sessionLength -1,
            });
          }
        }
      }
    }
  }
  reset(){
    this.interval();
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      length: 25,
      second: 0,
      break: false,
      display: 'Session',
      control: 'Start'
    });
    document.getElementById('beep').pause();
    document.getElementById('beep').currentTime = 0;
  }
  interval(v){
    switch(v){
      case 'a':
        this.intervals = setInterval(this.timer,1000);
        break;
      default:
        clearInterval(this.intervals);       
    }
  }
  startStop(){
    if (this.state.control === 'Start') {
      this.setState({
        control: 'Stop',
      }); 
      this.interval('a');
    } else {
      this.setState({
        control: 'Start'
      }); 
      this.interval();
    }
  }
  timer(){
    let s = this.state.second;
    if (this.state.control === 'Stop') {
      if (this.state.break === false) {
        let m = this.state.length;
        if (this.state.length == 0 && this.state.second == 0) {
          document.getElementById('beep').play();
          this.setState({
            break: true,
            length: this.state.breakLength,
            display: 'Break',
          });
        } else {
          if (s == 0 && m > 0) {
            s = 59;
            m = m - 1;
          } else {
            s = s - 1;
          }
          this.setState({
            length: m,
            second: s,
          });
        }
      } else {
        let m = this.state.length;
        if (this.state.length == 0 && this.state.second == 0) {
          document.getElementById('beep').play();
          this.setState({
            break: false,
            length: this.state.sessionLength,
            display: 'Session',
          });
        } else {
          if (s == 0 && m > 0) {
            s = 59;
            m = m - 1;
          } else {
            s = s - 1;
          }
          this.setState({
            length: m,
            second: s
          });
        }
      }
    }
  }
  clock(){
    if (this.state.break === false) {
      let minutes = this.state.length;
      let seconds = this.state.second;
      minutes < 10 ? minutes = '0' + minutes : minutes;
      seconds < 10 ? seconds = '0' + seconds : seconds;
      return minutes + ':' + seconds;
    } else {
      let minutes = this.state.length;
      let seconds = this.state.second; 
      minutes < 10 ? minutes = '0' + minutes : minutes;
      seconds < 10 ? seconds = '0' + seconds : seconds;
      return minutes + ':' + seconds;
    }
  }
  render() {
    return (
      <div className='maindiv'>
        <h1>Pomodoro Clock</h1>
        <audio id='beep' src="http://freesound.org/data/previews/198/198841_285997-lq.mp3" />
        <div className='displayDiv'>
          <div className='display' id='timer-label'>{this.state.display}</div>
          <div className='clock' id='time-left'>{this.clock()}</div>
          <button id='start_stop' onClick={this.startStop}>{this.state.control}</button>
          <button id='reset' onClick={this.reset}>Reset</button>
        </div>
        <Break
          break={this.state.breakLength}
          breakCount={this.brkCounter}/>
        <Session
          session={this.state.sessionLength}
          sessionCount={this.sesCounter}/>
      </div>
    )
  }
}

class Break extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div className='breakDiv'>
          <div id='break-label'>Break Length</div>
          <div id='break-length'>{this.props.break}</div> 
          <button id='break-increment' onClick={this.props.breakCount}>+</button> 
          <button id='break-decrement' class="minus" onClick={this.props.breakCount}>-</button>
        </div>
    )
  }
}

class Session extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
        <div className='sessionDiv'>
          <div id='session-label'>Session Length</div> 
          <div id='session-length'>{this.props.session}</div> 
          <button id='session-increment' onClick={this.props.sessionCount}>+</button> 
          <button id='session-decrement' class="minus" onClick={this.props.sessionCount}>-</button>
        </div>
    )
  }
}

ReactDOM.render(<ClockWork/>, document.getElementById('root'))