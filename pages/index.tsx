import React from 'react';

import useDebounce from '../hooks/useDebounce';
import useDidMountEffect from '../hooks/useDidMountEffect';


const isUnique = (s: string) => {
  return Array.from(new Set(Array.from(s))).length === s.length;
}

const Words = (props: {words: string[]}) => {
  return (
    <ul className="flex flex-wrap">
      {props.words.map(word => (
        <li className="p-2 bg-blue-200 bg-opacity-50 rounded-md m-1" key={word}>{word}</li>
      ))}
    </ul>
  )
}


const Home = () => {
  const [input, setInput] = React.useState('');
  const debouncedInput = useDebounce<string>(input, 500);
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [words, setWords] = React.useState<string[]>([]);

  useDidMountEffect(() => {
    if (debouncedInput.length === 0) {
      setLoading(false);
      setError(null);
    }
    else if (debouncedInput.length !== 7 || !isUnique(debouncedInput)) {
      setWords([]);
      setError("Input must be 7 unique letters");
    } else {
      setError(null);
      setLoading(true);
      fetch("/api/words", {
        method: "POST",
        body: JSON.stringify({
          letters: Array.from(debouncedInput)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        setLoading(false);
        setError(null);
        return response.json();
      }).then(json => {
        setWords(json.words);
      })
      .catch(error => {
        setLoading(false);
        setError(error);
      })
    }
  }, [debouncedInput]);
  return (
    <div className="p-2">
      <input
        autoFocus
        className='p-2 my-1 w-full border-2 border-blue-200 rounded-md'
        value={input}
        onChange={event => setInput(event.target.value)}
        placeholder="Enter today's 7 letters. The first letter should be the required letter"
      />
      {/* if loading, show loading spinner */}
      {loading && <div className="loading">Loading...</div>}
      {/* if error, show error message */}
      {error && <div className="error">{error}</div>}
      <Words words={words} />
    </div>
  );
}

export default Home