import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const listModels = async () => {
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    console.log(res.data.models.map(m => m.name));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};
listModels();
