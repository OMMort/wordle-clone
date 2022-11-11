window.onload = () => { 
   
  const FLIP_ANIMATION_DURATION = 500
  const DANCE_ANIMATION_DURATION = 500
  const keyboard = document.querySelector("[data-keyboard]")
  const alertContainer = document.querySelector("[data-alert-container]")
  const guessGrid = document.querySelector("[data-guess-grid]");
  let targetWordKey = 0;
/*
  const getDataFile = async (dataFile, callback) => {
    let dataSet  = await fetch(`./wordlists/${dataFile}.txt`)
    //use string literals
    let dataSetString = await dataSet.text();
    const dataSetClean = dataSetString.replace(/"/g, '').replace(/ /g, '').toLowerCase();
    const targetWords = dataSetClean.split(',');
    return targetWords;
   }

   const targetWords = async () => {
    let targetWordData = await getDataFile(dataFile);
     //now you can directly use jsonData
     return targetWordData;
   }   
*/

/*
  // get the word file
const fileDataSet = fetch(`./wordlists/${dataFile}.txt`)
    .then(response => response.text()) 
    .then(textString => {
      const dataSet = textString.replace(/"/g, '').replace(/ /g, '').toLowerCase();
      const targetWords = dataSet.split(',');     
  });

  console.log(fileDataSet);
*/
  const targetWords = wordList.map(w=>{return w.toLowerCase().replace(/ /g,'');});
  //console.log(targetWords);

  //get one word a day
  const offsetFromDate = new Date(2022, 0, 1)
  const msOffset = Date.now() - offsetFromDate
  const dayOffset = msOffset / 1000 / 60 / 60 / 24
  targetWordKey = dayOffset;


  // get a random word
  targetWordKey = Math.random() * targetWords.length;
  
  const targetWord = targetWords[Math.floor(targetWordKey)];
  const WORD_LENGTH = targetWord.length;

  // loop through word and create letter count dataset
  let foundLetters = [];
  let letterCounter = [];
  letterCounter['word'] = targetWord;
  let currentLetter = '';
  for(let i=0;i<=WORD_LENGTH;i++){
    currentLetter = targetWord[i];
    if (!letterCounter[currentLetter]) {
        letterCounter[currentLetter] = 1;
    } else {
        letterCounter[currentLetter]++;
    }
    
  }
  console.log(letterCounter);
/*
  fetch('./d3.js')
  .then(response => response.text()) 
  .then(textString => {
    const dataSet = textString.replace(/"/g, '').replace(/ /g, '').toLowerCase();
    const rows = dataSet.split(',');
    console.log(rows);
  });  
  */
  //add custom game words to default dictionary
  const gameDictionary = dictionary.concat(targetWords);

  function buildInterface(){
    
    const interfaceContainer = document.querySelector('.interface');
    for( let i=0; i<availableGames.length; i++){
      const label = availableGames[i];
      let interfaceLink = ( label != 'standard') ? `/?game=${label}` : '/'
    // populate interface
      const interfaceElement = document.createElement('a');
      if(dataFile === label){
        interfaceElement.classList.add('current');
      }
      
      interfaceElement.setAttribute('href', interfaceLink);
      interfaceElement.innerHTML = (label.toUpperCase());
      interfaceContainer.appendChild(interfaceElement);      
    }

    //build word list data
    const interfaceElement = document.createElement('p');
    interfaceElement.innerHTML = (`This ${dataFile.toUpperCase()} word search contains ${targetWords.length} words specially selected for you to guess from, the chosen word is ${WORD_LENGTH} characters long.  Good Luck!`);
    interfaceContainer.appendChild(interfaceElement);      

  }
  
  function buildGrid(){
    //set grid size
    const gridSize = WORD_LENGTH*6;
    //get grid container
    const gridContainer = document.querySelector('.guess-grid');
    //set grid columns to match word size
    gridContainer.style.gridTemplateColumns = `repeat(${WORD_LENGTH}, 4em)`;
  
    const debugHeader = `WORD: ${targetWord} / gridSize: ${WORD_LENGTH}*6 = ${gridSize}`;
    const normalHeader = 'CUSTOM WORDLISH ';
    const edition = (!gameType) ? 'STANDARD' : gameType.toUpperCase().replace('-','').replace(' ','');
    const gridHeaderText = normalHeader+edition;
  
    // populate grid header
    const gridHeader = document.querySelector('.grid-header');
    const gridHeaderTitle = document.createElement('h1');
    gridHeaderTitle.innerHTML = (gridHeaderText);
    gridHeader.appendChild(gridHeaderTitle);
  
    
    for(let i=0;i<gridSize;i++){
      let gridTile = document.createElement('div');
      gridTile.classList.add('tile');    
      gridContainer.appendChild(gridTile);
    }
  
  }
  
  buildInterface();
  buildGrid();
  startInteraction()
  
  function startInteraction() {
    document.addEventListener("click", handleMouseClick)
    document.addEventListener("keydown", handleKeyPress)
  }
  
  function stopInteraction() {
    document.removeEventListener("click", handleMouseClick)
    document.removeEventListener("keydown", handleKeyPress)
  }
  
  function handleMouseClick(e) {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key)
      return
    }
  
    if (e.target.matches("[data-enter]")) {
      submitGuess()
      return
    }
  
    if (e.target.matches("[data-delete]")) {
      deleteKey()
      return
    }
  }
  
  function handleKeyPress(e) {
    if (e.key === "Enter") {
      submitGuess()
      return
    }
  
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteKey()
      return
    }
  
    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key)
      return
    }
  }
  
  function pressKey(key) {
    const activeTiles = getActiveTiles()
    if (activeTiles.length >= WORD_LENGTH) return
    const nextTile = guessGrid.querySelector(":not([data-letter])")
    nextTile.dataset.letter = key.toLowerCase()
    nextTile.textContent = key
    nextTile.dataset.state = "active"
  }
  
  function deleteKey() {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
  }
  
  function submitGuess() {
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Not enough letters")
      shakeTiles(activeTiles)
      return
    }
  
    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter
    }, "")
  
    if (!gameDictionary.includes(guess)) {
      showAlert("Not in word list")
      shakeTiles(activeTiles)
      return
    }
  
    stopInteraction()

    activeTiles.forEach((...params) => function(...params){
        const letter = tile.dataset.letter
        if (targetWord[index] === letter) {
            foundLetters[index] = letter;
        }
    });

    activeTiles.forEach((...params) => flipTile(...params, guess))
  }
  
  function flipTile(tile, index, array, guess) {
    const letter = tile.dataset.letter
    const key = keyboard.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)
  
    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct";
          key.classList.add("correct");
          foundLetters[index] = letter;
        } else if (targetWord.includes(letter) ) {
          
            if( foundLetters.includes(letter) ){

                if( letterCounter[letter] > 1 ){
                    tile.dataset.state = "wrong-location"
                    key.classList.add("wrong-location")
                } else {
                    tile.dataset.state = "wrong"
                }

            } else {
                tile.dataset.state = "wrong-location"
                key.classList.add("wrong-location")                
            }
                    
        } else {
          tile.dataset.state = "wrong"
          key.classList.add("wrong")
        }
  
        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              startInteraction()
              checkWinLose(guess, array)
            },
            { once: true }
          )
        }
      },
      { once: true }
    )
  }
  
  function getActiveTiles() {
    return guessGrid.querySelectorAll('[data-state="active"]')
  }
  
  function showAlert(message, duration = 1000) {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.prepend(alert)
    if (duration == null) return
  
    setTimeout(() => {
      alert.classList.add("hide")
      alert.addEventListener("transitionend", () => {
        alert.remove()
      })
    }, duration)
  }
  
  function shakeTiles(tiles) {
    tiles.forEach(tile => {
      tile.classList.add("shake")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake")
        },
        { once: true }
      )
    })
  }
  
  function checkWinLose(guess, tiles) {
    if (guess === targetWord) {
      showAlert("You Win", 5000)
      danceTiles(tiles)
      stopInteraction()
      return
    }
  
    const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null)
      stopInteraction()
    }
  }
  
  function danceTiles(tiles) {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance")
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance")
          },
          { once: true }
        )
      }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
  }
  
  
};