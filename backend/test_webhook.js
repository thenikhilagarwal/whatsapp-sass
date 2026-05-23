import axios from 'axios';

const testWebhook = async () => {
  try {
    const payload = {
      object: "whatsapp_business_account",
      entry: [
        {
          id: "1112857248571753",
          changes: [
            {
              value: {
                messaging_product: "whatsapp",
                metadata: {
                  display_phone_number: "15550543669",
                  phone_number_id: "1112857248571753"
                },
                contacts: [
                  {
                    profile: {
                      name: "Test User"
                    },
                    wa_id: "917976659446"
                  }
                ],
                messages: [
                  {
                    from: "917976659446",
                    id: "wamid.HBgMOTE3OTc2NjU5NDQ2FQIAEhgUM0E1RDhGNTdCQzY4NDI1NUM5QTgA",
                    timestamp: "1715440000",
                    text: {
                      body: "Hello, this is a test from Antigravity."
                    },
                    type: "text"
                  }
                ]
              },
              field: "messages"
            }
          ]
        }
      ]
    };

    console.log("Sending POST to /api/webhook...");
    const res = await axios.post("http://localhost:5000/api/webhook", payload);
    console.log("Response Status:", res.status);
    console.log("Response Body:", res.data);
  } catch (err) {
    console.error("Webhook Error Status:", err.response?.status);
    console.error("Webhook Error Data:", err.response?.data);
    console.error("Webhook Error Message:", err.message);
  }
};

testWebhook();
