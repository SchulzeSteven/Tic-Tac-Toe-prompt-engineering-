let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
    [0, 4, 8], [2, 4, 6], // diagonal
];

let currentPlayer = 'circle'; // Start with 'circle', it will alternate between 'circle' and 'cross'

function init() {
    render();
    renderPlayerInfo()
}

function render() {
    const contentDiv = document.getElementById('content');
    // Generate table HTML
    let tableHtml = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHtml += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            let symbol = '';
            if (fields[index] === 'circle') {
                symbol = generateAnimatedCircleSVG();
            } else if (fields[index] === 'cross') {
                symbol = generateAnimatedCrossSVG();
            }
            tableHtml += `<td onclick="handleClick(this, ${index})">${symbol}</td>`;
        }
        tableHtml += '</tr>';
    }
    tableHtml += '</table>';
    // Set table HTML to contentDiv
    contentDiv.innerHTML = tableHtml;
}


function renderPlayerInfo() {
    // Das Element 'player-info' wird über seine ID aus dem DOM ausgewählt
    
    const playerNameSpan = document.getElementById('player-name');

    // Überprüfen, welcher Spieler gerade an der Reihe ist und den entsprechenden Spielernamen generieren
    let playerName;
    if (currentPlayer === 'circle') {
        playerName = 'Kreis';
    } else {
        playerName = 'Kreuz';
    }

    // Generiere die Nachricht basierend auf dem aktuellen Spielerstatus und setze sie als Textinhalt des Elements und die Farbe
    playerNameSpan.textContent = playerName;
    playerNameSpan.style.color = 'red';
}


function restartGame(){
    fields = [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
    ];
    render();
}


function handleClick(cell, index) {
    if (fields[index] === null) {
        fields[index] = currentPlayer;

        //KurzForm:  "cell.innerHTML = currentPlayer === 'circle' ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();""
        if (currentPlayer === 'circle') {
            cell.innerHTML = generateAnimatedCircleSVG();
        } else {
            cell.innerHTML = generateAnimatedCrossSVG();
        }
        cell.onclick = null;

        // KurzForm:  "currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';"
        if (currentPlayer === 'circle') {
            currentPlayer = 'cross';
        } else {
            currentPlayer = 'circle';
        }

        // Game Ende und Zeichnung
        if (isGameFinished()) {
            const winCombination = getWinningCombination();
            drawWinningLine(winCombination);
        }
    }
    renderPlayerInfo()
}


function isGameFinished() {
    return fields.every((field) => field !== null) || getWinningCombination() !== null;
}

function getWinningCombination() {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
        const [a, b, c] = WINNING_COMBINATIONS[i];  // [0, 1, 2]
        if (fields[a] === fields[b] && fields[b] === fields[c] && fields[a] !== null) {
            return WINNING_COMBINATIONS[i];
        }
    }
    return null;
}


function drawWinningLine(combination) {
    const lineColor = '#ffffff';
    const lineWidth = 4;

  
    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();


    const contentRect = document.getElementById('content').getBoundingClientRect();

    const lineLength = Math.sqrt(
      Math.pow(endRect.left - startRect.left, 2) + Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left);

  
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${startRect.top + startRect.height / 2 - lineWidth / 1.9 - contentRect.top}px`;
    line.style.left = `${startRect.left + startRect.width / 1.9 - contentRect.left}px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById('content').appendChild(line);
}


function generateAnimatedCircleSVG() {
    const circleColor = '#00B0EF';
    const circleSize = 80;
    
    const svgCode = `
        <svg width="${circleSize}" height="${circleSize}" viewBox="0 0 ${circleSize} ${circleSize}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${circleSize / 2.5}" fill="none" stroke="${circleColor}" stroke-width="8" stroke-dasharray="${2 * Math.PI * (circleSize / 2)}" stroke-dashoffset="${2 * Math.PI * (circleSize / 2)}">
                <animate attributeName="stroke-dashoffset" from="${2 * Math.PI * (circleSize / 2)}" to="0" dur="1s" fill="freeze" />
            </circle>
        </svg>
    `;

    return svgCode;
}


function generateAnimatedCrossSVG() {
    const crossColor = '#FFC000';
    const crossSize = 70;
    
    const svgCode = `
        <svg width="${crossSize}" height="${crossSize}" viewBox="0 0 ${crossSize} ${crossSize}" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="${crossSize}" x2="${crossSize}" y2="0" stroke="${crossColor}" stroke-width="8" stroke-dasharray="${Math.sqrt(2) * crossSize}" stroke-dashoffset="${Math.sqrt(2) * crossSize}">
                <animate attributeName="stroke-dashoffset" from="${Math.sqrt(2) * crossSize}" to="0" dur="1s" fill="freeze" />
            </line>
            <line x1="0" y1="0" x2="${crossSize}" y2="${crossSize}" stroke="${crossColor}" stroke-width="8" stroke-dasharray="${Math.sqrt(2) * crossSize}" stroke-dashoffset="${Math.sqrt(2) * crossSize}">
                <animate attributeName="stroke-dashoffset" from="${Math.sqrt(2) * crossSize}" to="0" dur="1s" fill="freeze" />
            </line>
        </svg>
    `;

    return svgCode;
}

