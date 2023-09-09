import { create } from 'axios';

require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

const client = create({
  headers: {
    Authorization: 'Bearer ' + apiKey,
  },
});

const params = {
  prompt: 'How are you?',
  model: 'gpt-3.5-turbo',
  max_tokens: 10,
  temperature: 0,
};

client
  .post('https://api.openai.com/v1/completions', params)
  .then((result) => {
    console.log(result.data.choices[0].text);
  })
  .catch((err) => {
    console.log(err);
  });
