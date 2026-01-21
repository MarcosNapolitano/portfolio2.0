import { useEffect, useRef, useState } from 'react'
import { quotes, authors, colors } from './quotes_db'
import '../styles/quotes.css'

interface Quote {
  quote: typeof quotes[number];
  author: typeof authors[number];
  color: typeof colors[number];
}

export default function Quotes() {

  const [visible, setVisible] = useState<boolean>(true);
  const global = useRef<HTMLDivElement>(null);
  const [quote, setQuote] = useState<Quote>({
    quote: quotes[0],
    author: authors[0],
    color: colors[0]
  });

  useEffect(() => {

    setVisible(true)
  }, [quote])

  const handleNewQuote = () => {

    setVisible(false)
    let quoteIndex: number = Math.floor(Math.random() * quotes.length);
    let colorIndex: number = Math.floor(Math.random() * colors.length);

    while (colors[colorIndex] === quote.color)
      colorIndex = Math.floor(Math.random() * colors.length);

    while (quotes[quoteIndex] === quote.quote)
      quoteIndex = Math.floor(Math.random() * quotes.length);

    global.current?.style.setProperty('--new-color', colors[colorIndex]);

    setTimeout(() => {
      setQuote({
        quote: quotes[quoteIndex],
        author: authors[quoteIndex],
        color: colors[colorIndex]
      });
      
      global.current?.style.setProperty('--main-color', colors[colorIndex]);
    }, 1200);
  };

  return (
    <div ref={global} className='quote-root quote-box'>
      <div className='quote'>
        <h2 className={visible ? 'fade-in' : 'fade-out text-color-fade'} id='text'>
          {quote?.quote}
        </h2>
      </div>
      <p className={visible ? 'quote-author fade-in' : 'quote-author fade-out text-color-fade'}>
        - {quote?.author}
      </p>
      <div className="quote-link-container">
        <a
          href={`https://twitter.com/intent/tweet?text="${quote?.quote}"- ${quote?.author}`}
          target="_blank" id="tweet-quote">
          <i className="fa-brands fa-twitter-square" id="twitter" />
        </a>
        <button
          className={visible ? 'new-quote' : 'new-quote background-color-fade'}
          onClick={handleNewQuote}>
          New Quote
        </button>
      </div>
    </div>
  )
};
