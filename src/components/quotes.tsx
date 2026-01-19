import React from 'react'
import { quotes, authors, colors } from './data.js'

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state={
      quotes: quotes,
      authors: authors,
      colors: colors,
      quote:'',
      author:'',
      color: "rgb(143, 35, 35)"

    };
    this.newQuote = this.newQuote.bind(this);
  };
  
  componentDidMount() {
    
    window.addEventListener('load', this.newQuote) 
    this.newQuote() 
    
  }

  componentWillUnmount() { 
    window.removeEventListener('load', this.newQuote)  
  }
  
  newQuote() {
    const Index = Math.floor(Math.random() * this.state.quotes.length);
    const Color = Math.floor(Math.random() * this.state.colors.length);

    $('#text').fadeToggle(750)
    $('#author').fadeToggle(750)
    
    setTimeout(()=>{

      this.setState({
        quote: this.state.quotes[Index],
        author: this.state.authors[Index],
        color: this.state.colors[Color]
      });

      $("Body").animate({backgroundColor: this.state.color, color: this.state.color}, 750)
      $("#twitter").animate({color: this.state.color}, 750)
      $("#new-quote").animate({backgroundColor: this.state.color}, 750)
      $('#text').fadeToggle(750)
      $('#author').fadeToggle(750)

    },750)
    
  };

  render() {
    return(
      <div id='quote-box' onLoad={this.newQuote}>
        <div id='quote'>
          <h2 id='text'>{this.state.quote}</h2>
        </div>
        <p id='author'>- {this.state.author}</p>
        <div id="link-container">
          <a href={`https://twitter.com/intent/tweet?text="${this.state.quote}"- ${this.state.author}`} target="_blank" id="tweet-quote">
            <i className="fa-brands fa-twitter-square" id="twitter" />
          </a>
          <button id="new-quote" onClick={this.newQuote}>New Quote</button>
        </div>
      </div>
    )
  }
};
  
export default App