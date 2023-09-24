//playbtn click should make the gametable visible
//and then disable itself so that you can't click during ongoing game

//making a random deck
const cardsArr = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "K", "Q", "A"];
let suitsArr = ["♠", "♥", "♦", "♣"];

let deck = [];

for (let s of suitsArr) {
  for (let c of cardsArr) {
    deck.push({ suit: s, val: c });
  }
}

let shuffledeck = [];

while (deck.length > 0) {
  let randomval = Math.floor(Math.random() * deck.length);
  let randomcard = deck.splice(randomval, 1);
  shuffledeck.push(randomcard[0]);
}
//console.log(shuffledeck); making and shuffling deck done

function scoreHand(cardsArr) {
  var score = 0;
  var numAces = 0;
  for (i = 0; i < cardsArr.length; i++) {
    switch (cardsArr[i]) {
      case "A":
        score += 11;
        numAces++;
        break;
      case "K":
      case "Q":
      case "J":
        score += 10;
        break;
      default:
        score += parseInt(cardsArr[i]);
    }
  }
  while (numAces > 0 && score > 21) {
    score -= 10; // decrement 10 for each ace until total is less than 21
    numAces--;
  }
  return score;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function drawcards() {
  await sleep(1000);
  console.log("waiting for card");
}
//selecting the button , cards  and msg area
let playbutton = document.querySelector(".playbtn");
let staybutton = document.querySelector(".staybtn");
let hitbutton = document.querySelector(".hitbtn");
let restartbutton = document.querySelector(".restartbtn");
let gametable = document.querySelector(".gametable");
let playerscards = document.querySelector(".playerscards");
let dealerscards = document.querySelector(".dealerscards");
let dealersmsg = document.querySelector(".dealersmsg");
let msg = document.querySelector(".msg");
let playertotal = document.querySelector(".playertotal");

let pcArr = []; // player cards array to store val of player cards
let dcArr = [];

function restartgame() {
  restartbutton.classList.toggle("hidden");
  playbutton.disabled = true;
  staybutton.disabled = true;
  hitbutton.disabled = true;
  restartbutton.addEventListener("click", (e) => {
    location.reload();
  });
}

playbutton.addEventListener("click", async (e) => {
  playbutton.disabled = true;
  gametable.classList.toggle("hidden");

  let pc1 = shuffledeck.pop();
  let pc2 = shuffledeck.pop();
  let dc1 = shuffledeck.pop();
  let dc2 = shuffledeck.pop();

  pcArr.push(pc1.val, pc2.val);
  dcArr.push(dc1.val, dc2.val);

  let pc1card = document.createElement("p");
  pc1card.textContent = `${pc1.val} ${pc1.suit}`;
  let pc2card = document.createElement("p");
  pc2card.textContent = `${pc2.val} ${pc2.suit}`;
  let dc1card = document.createElement("p");
  dc1card.textContent = `${dc1.val} ${dc1.suit}`;
  let dc2card = document.createElement("p");
  dc2card.textContent = `${dc2.val} ${dc2.suit}`;

  playerscards.appendChild(pc1card);
  await drawcards();
  playerscards.appendChild(pc2card);
  await drawcards();
  dealerscards.appendChild(dc1card);
  dc2card.classList.toggle("hidden");
  dealerscards.appendChild(dc2card);

  playertotal.textContent = scoreHand(pcArr);

  if (scoreHand(pcArr) == 21) {
    // blackjack on flop
    console.log("Blackjack you win");
    msg.textContent = "BLACKJACK YOU WIN";
    //function restart
    restartgame();
  }

  hitbutton.addEventListener("click", () => {
    let pc = shuffledeck.pop();
    pcArr.push(pc.val);
    let pccard = document.createElement("p");
    pccard.textContent = `${pc.val} ${pc.suit}`;
    playertotal.textContent = scoreHand(pcArr);
    playerscards.appendChild(pccard);
    if (scoreHand(pcArr) > 21) {
      // you can lose during hit
      console.log(" Bust you lose");
      msg.textContent = "BUST YOU LOSE";
      //function restart
      restartgame();
    }
    if (scoreHand(pcArr) == 21) {
      // blackjack
      console.log("Blackjack you win");
      msg.textContent = "BLACKJACK YOU WIN";
      //function restart
      restartgame();
    }
  });

  staybutton.addEventListener("click", async () => {
    drawcards();
    hitbutton.disabled = true;
    dc2card.classList.toggle("hidden"); //SHOW the hidden card
    dealersmsg.classList.toggle("hidden"); // show dealer total
    dealersmsg.textContent = `Dealers total : ${scoreHand(dcArr)}`;

    while (scoreHand(dcArr) < 17) {
      // dealer draws until his total is 17
      let dc = shuffledeck.pop();
      dcArr.push(dc.val);
      let dccard = document.createElement("p");
      dccard.textContent = `${dc.val} ${dc.suit}`;
      await drawcards();
      dealerscards.appendChild(dccard);
      dealersmsg.textContent = `Dealers total : ${scoreHand(dcArr)}`;
    }
    //win-lose conditions
    if (scoreHand(dcArr) > 21) {
      msg.textContent = "DEALER BUST YOU WIN";
    } else if (scoreHand(dcArr) >= scoreHand(pcArr)) {
      msg.textContent = "YOU LOSE";
    } else {
      msg.textContent = "YOU WIN";
    }
    restartgame();
  });
});
