const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/create", async (req, res) => {
  const type = req.query.type;
  const keyword = req.body.keyword;

  let completion_text = "";

  if (type == "quote") {
    completion_text = `Act as an Excellent Quote generator, The user will provide you a keyword as an input and you have to generate a Quote`;
  } else if (type == "story") {
    completion_text = `Act as an Excellent Story generator, The user will provide you a keyword as an input and you have to generate a Story`;
  }
  const messages = [];

  messages.push({ role: "user", content: keyword });
  messages.push({ role: "assistant", content: completion_text });

  try {
    if (!keyword) throw new Error("No input is provided");

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    if (type == "story") {
      console.log("type", type);
      console.log(completion.data.choices[0].message.content.split("\n"));
      res.send(
        JSON.stringify(completion.data.choices[0].message.content.split("\n"))
      );
    } else {
      console.log(completion.data.choices[0].message.content.split("\n")[0]);
      res.send(
        JSON.stringify(completion.data.choices[0].message.content.split("\n")[0])
      );
    }
  } catch (error) {
    res.send({ msg: error.message });
  }
});

app.listen(8080, () => {
  console.log("server running at 8080");
});
