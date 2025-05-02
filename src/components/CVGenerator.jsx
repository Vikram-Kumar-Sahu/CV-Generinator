import { useState } from 'react';
import axios from 'axios';
import Styles from './CVGenerator.module.css';

function CVGenerator({ setData, prompt, place }) {
  const [question, setQuestion] = useState('');

  async function generateAnswer() {
    setQuestion('loading...');

    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBMcVUKC1AR7uuGC31P9WDU3YxxyGzpzmo',
        method: 'post',
        data: {
          contents: [
            {
              parts: [
                {
                  text: question + ' ' + prompt, 
                },
              ],
            },
          ],
        },
      });

      const generatedContent = response.data.candidates[0].content.parts[0].text;
      setQuestion(generatedContent);
      setData(generatedContent); 
    } catch (error) {
      setQuestion('Error generating answer. Please try again.');
      console.error(error);
    }
  }

  return (
    <div className='hero'>
      <textarea
        
        className={Styles.inp}
        placeholder={place}
        id="textarea"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        wrap="soft" 
        cols="30"
        rows="10"
      />
      <button onClick={generateAnswer}>Generate Answer</button>
    </div>
  );
}

export default CVGenerator;