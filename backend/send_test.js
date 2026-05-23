import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;
const data = {
  messaging_product: "whatsapp",
  to: "917976659446",
  type: "template",
  template: {
    name: "hello_world",
    language: {
      code: "en_US"
    }
  }
};

axios.post(url, data, {
  headers: {
    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
    "Content-Type": "application/json",
  }
}).then(res => {
  console.log("✅ Message sent successfully!");
  console.log(res.data);
}).catch(err => {
  console.error("❌ Failed to send message.");
  console.error(err.response ? JSON.stringify(err.response.data, null, 2) : err.message);
});
