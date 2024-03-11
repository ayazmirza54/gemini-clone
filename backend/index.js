// // node --version # Should be >= 18
// // npm install @google/generative-ai

// const PORT = 8000;
// const express = require("express");
// const cors = require("cors");
// const app = express();
// app.use(cors());
// app.use(express.json());
// require("dotenv").config();

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const MODEL_NAME = "gemini-1.0-pro";
// const API_KEY = process.env.API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// app.post("/gemini", async (req, res) => {
//   console.log(req.body.history);
//   console.log(req.body.message);
//   if (!Array.isArray(req.body.history)) {
//     req.body.history = []; // Initialize as an empty array if not already
//   }
//   const model = genAI.getGenerativeModel({ model: MODEL_NAME });

//   const chat = model.startChat({
//     history: req.body.history,
//   });

//   const msg = req.body.message;
//   const result = await chat.sendMessage(msg);
//   const response = await result.response;
//   const text = await response.text();
//   res.send(text);
// });

// app.listen(PORT, () => {
//   console.log(`AI server running on http://localhost:${PORT}`);
// });
// Backend code (Node.js)
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const PORT = 8000;
const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
app.get("/", (req, res) => {
  res.send("AI server has been started");
});
app.post("/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    const chat = model.startChat({
      history: req.body.history || [],
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = await response.text();

    res.send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
