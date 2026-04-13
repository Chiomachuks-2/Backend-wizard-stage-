const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/api/classify', async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Missing name parameter' 
    });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(422).json({ 
      status: 'error', 
      message: 'Invalid name parameter' 
    });
  }

  try {
    const { data } = await axios.get(`https://api.genderize.io/?name=${encodeURIComponent(name.trim())}`);

    if (!data.gender || data.count === 0) {
      return res.status(200).json({ 
        status: 'error', 
        message: 'No prediction available for the provided name' 
      });
    }

    const result = {
      status: 'success',
      data: {
        name: name.toLowerCase().trim(),
        gender: data.gender,
        probability: data.probability,
        sample_size: data.count,
        is_confident: data.probability >= 0.7 && data.count >= 100,
        processed_at: new Date().toISOString()
      }
    };

    res.status(200).json(result);

  } catch (error) {
    const statusCode = error.response ? 502 : 500;
    const message = error.response ? 'External API error' : 'Server error';
    res.status(statusCode).json({ status: 'error', message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
module.exports = app;
