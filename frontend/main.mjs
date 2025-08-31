const API = "https://pratiamalden-quote.hosting.codeyourfuture.io/api";

const quote = document.getElementById("quote");
const author = document.getElementById("author");
const randomBtn = document.getElementById("random-quote");
const autoPlay = document.getElementById("autoplay");
const autoPlayStatus = document.getElementById("autoplay-status");
const quoteInput = document.getElementById("quote-input");
const authorInput = document.getElementById("author-input");
const hiddenDiv = document.getElementById("hiddenDiv");
const addBtn = document.getElementById("add-quote");
const form = document.getElementById("quote-form");

let autoPlayInterval;

// view random quote (from backend)
function renderQuote(data){
  if (
    !data ||
    typeof data != "object" ||
    typeof data.quote != "string" ||
    typeof data.author != "string"
  ) {
    throw new Error("Unexpected response shape.");
  }

  quote.textContent = data.quote;
  author.textContent = data.author || "";
}

async function fetchRandomQuote(){
  try{
    const res = await fetch(API); 
    if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    renderQuote(data);
  } catch (error) {
    console.error(`Fetch failed: ${error.message}`);    
  }
}

async function submitNewQuote(e){
  e.preventDefault();

  const payload = { quote: quoteInput.value, author: authorInput.value }

  try{
    const res = await fetch(API, { 
      method: 'POST',
      headers: { "Content-Type": 'application/json' },
      body: JSON.stringify(payload)
    });
    if(!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const text = await res.text();
    if (text.toLowerCase() !== "ok") console.warn(`Unexpected POST response: ${text}`);

    await fetchRandomQuote();
    e.target.reset();

  } catch (error) {
    console.log(`${error.message}`);
  }

}

// toggle auto play
function toggleAutoPlay() {
  if (autoPlay.checked) {
    autoPlayStatus.innerText = "Auto-play: ON";
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(fetchRandomQuote, 5000);
  } else {
    autoPlayStatus.innerText = "Auto-play: OFF";
    clearInterval(autoPlayInterval);
    autoPlayInterval = null;
  }
}

window.onload = () => {
  // Initial load
  fetchRandomQuote();

  randomBtn.addEventListener("click", fetchRandomQuote);
  autoPlay.addEventListener("change", toggleAutoPlay);
  addBtn?.addEventListener("click", () => {
    hiddenDiv.style.display =
      hiddenDiv.style.display === "none" ? "block" : "none";
  });
  form?.addEventListener("submit", submitNewQuote);
};