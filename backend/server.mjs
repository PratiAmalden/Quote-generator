import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// middleware
app.use(cors()); // allow cross-origin during dev
app.use(express.json());

// in-memory store
const quotes = [
  {
    quote: "Life isn't about getting and having, it's about giving and being.",
    author: "Kevin Kruse",
  },
  {
    quote: "Whatever the mind of man can conceive and believe, it can achieve.",
    author: "Napoleon Hill",
  },
  {
    quote: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein",
  },
  {
    quote:
      "The most difficult thing is the decision to act, the rest is merely tenacity.",
    author: "Amelia Earhart",
  },
  {
    quote: "Every strike brings me closer to the next home run.",
    author: "Babe Ruth",
  },
  {
    quote: "Definiteness of purpose is the starting point of all achievement.",
    author: "W. Clement Stone",
  },
];

function randomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

// API: GET / returns a random quote
app.get("/", (req, res) => {
  res.json(randomQuote());
});

// handle POST / adds a new quotes
app.post("/", (req, res) => {
  const body = req.body;

  if(typeof body !== "object" || !("quote" in body) || !("author" in body)){
    return res
      .status(400)
      .send(
        "Expected body to be a JSON object containing keys quote and author"
      );
  }
  
  const quote = body.quote.trim();
  const author = body.author.trim();

  if(!quote || !author){
    return res.status(400).send("Both quote and author must be non-empty strings!")
  }

  const created = { quote, author };
  quotes.push(created);
  return res.status(201).send("ok");

});

app.listen(port, () => {
  console.error(`Quote server on port: ${port}`);
});
