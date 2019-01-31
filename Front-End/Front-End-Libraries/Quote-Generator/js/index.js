/*class Icon extends React.Component {
  render(){
    return (
      <i className='fab fa-twitter'/>
    )
  }
}*/
class QuoteApp extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      quoteAndName: quoteList[0],
    }
    this.randomQuote = this.randomQuote.bind(this)
  } 
  randomQuote() {
    var getRandom = Math.floor(Math.random() * Math.floor(quoteList.length));
    this.setState ({
      quoteAndName: quoteList[getRandom],
    })
  }
    render() {
        return (
            <div className="div1">
             <h1 className="time">Quotes</h1>
              <div className="div2">
                <div><p id="text">{this.state.quoteAndName.quote}</p><hr/></div>
                <div><p id="author">{this.state.quoteAndName.name}</p></div>
                <div className="div3"><a id="tweet-quote" href="twitter.com/intent/tweet">Tweet{/*<Icon/>*/}</a>
                  <button id="new-quote" onClick={this.randomQuote}>Random</button></div>
              </div>
            </div>
        )
    }
}

// quote and name list
const quoteList = [{
  quote:'A room without books is like a body without a soul.',name:'Marcus Tullius Cicero'
},{
  quote:'Don\'t cry because it\'s over, smile because it happened.',name:'Dr. Seuss'
},{
  quote:'Be yourself; everyone else is already taken.',name:'Oscar Wilde'
},{
  quote:'So many books, so little time.',name:' Frank Zappa'
},{
  quote:'Two things are infinite: the universe and human stupidity; and I\'m not sure about the universe.',name:'Albert Einstein'
},{
  quote:'You only live once, but if you do it right, once is enough',name:'Mae West'
},{
  quote:'Be the change that you wish to see in the world.',name:'Mahatma Gandhi'
},{
  quote:'In three words I can sum up everything I\'ve learned about life: it goes on.',name:'Robert Frost'
},{
  quote:'If you tell the truth, you don\'t have to remember anything.',name:'Mark Twain'
},{
  quote:'A friend is someone who knows all about you and still loves you.',name:'Elbert Hubbard'
},];

ReactDOM.render(
  <QuoteApp />,
    document.getElementById('quote-box')
);