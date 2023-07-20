// Inspired by Tech with Tim JavaScript Project

// 1. Deposit some money ✅
// 2. Determine number of lines to bet on ✅
// 3. Collect a bet amount ✅
// 4. Spin the slot machine ✅
// 5. check if user won ✅
// 6. give user their winnings ✅
// 7. play again ✅

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C": 3,
    "D": 2
}


const deposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: ");
        const finaldeposit = parseFloat(depositAmount);
        if (isNaN(finaldeposit) || finaldeposit <= 0) {
            console.log("Invalid deposit amount, try again")
        } else {
         return finaldeposit
        }
    };
};

const getNumOfLines = () => {
    while (true) {
        const lines = prompt("Enter the number of lines to bet on (1-3): ");
        const numOfLines = parseFloat(lines);
        if (isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
            console.log("Invalid number of lines, try again")
        } else {
         return numOfLines
        }
    };
}
    
const getBet = (balance, lines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
        if (isNaN(numberBet) || numberBet * lines > balance) {
            console.log("Invalid bet, try again")
        } else {
         return numberBet
        }
    };
}


const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i <COLS; i++) {
        reels.push([])
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
};


const transpose = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i ++ ) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = ""
        for (const [i,symbol] of row.entries()) {
            rowString += symbol;
            (i != row.length - 1) && (rowString += " | ");
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for (let row = 0; row < lines; row ++) {
        const symbols = rows[row];
        let allSame = true;

        while (allSame === true) {
            for (const symbol of symbols) {
                if (symbol != symbols[0]) {
                    allSame = false;
                }
            }
        }

        allSame && (winnings += bet * SYMBOL_VALUES[symbols[0]]);
        return winnings;
    }
}


const game = () => {
    let balance = deposit();
    let playAgain = true;
    while (balance > 0 && playAgain === true) {
        const numOfLines = getNumOfLines();
        const bet = getBet(balance, numOfLines);
        balance = balance - bet * numOfLines
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numOfLines);
        console.log((winnings == 0) ? "Sorry you didn't win anything this time!" : ("you won $ " + winnings + "!"))
        balance = balance + winnings;
        console.log("balance remaining: $" + balance);
        balance > 0 && (prompt("Do you want to play again (y/n)? ") != "y") && (playAgain = false);
    }

    (prompt("Do you want to deposit more money (y/n)? ") === 'y') && game();
};

game();