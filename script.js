
    // Card symbols using a mix of emojis
    const symbols = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
        '🦁', '🐯', '🐨', '🐮', '🐷', '🐸', '🐵', '🦄',
        '🦋', '🐢', '🐙', '🦀', '🐠', '🐳', '🦕', '🦖'
    ];
    
    // Game state variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 3; // Default for easy
    let moves = 0;
    let timer = null;
    let seconds = 0;
    let gameStarted = false;
    let isProcessing = false;
    let difficulty = 'easy';
    
    // DOM Elements
    const selectionScreen = document.getElementById('selection-screen');
    const gameScreen = document.getElementById('game-screen');
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const timerElement = document.getElementById('timer');
    const matchesElement = document.getElementById('matches');
    const totalPairsElement = document.getElementById('total-pairs');
    const winModal = document.getElementById('win-modal');
    const finalTimeElement = document.getElementById('final-time');
    const finalMovesElement = document.getElementById('final-moves');
    const restartBtn = document.getElementById('restart-btn');
    const homeBtn = document.getElementById('home-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const backToMenuBtn = document.getElementById('back-to-menu-btn');
    const easyLevel = document.getElementById('easy-level');
    const mediumLevel = document.getElementById('medium-level');
    const hardLevel = document.getElementById('hard-level');
    
    // Initialize game
    function initGame() {
        clearInterval(timer);
        seconds = 0;
        moves = 0;
        matchedPairs = 0;
        flippedCards = [];
        gameStarted = false;
        isProcessing = false;
        
        // Update UI
        timerElement.textContent = '00:00';
        movesElement.textContent = '0';
        matchesElement.textContent = `0 / ${totalPairs}`;
        totalPairsElement.textContent = totalPairs;
        
        // Clear game board
        gameBoard.innerHTML = '';
        
        // Set up grid based on difficulty
        let columns;
        switch(difficulty) {
            case 'easy':
                columns = 'repeat(3, 1fr)';
                break;
            case 'medium':
                columns = 'repeat(4, 1fr)';
                break;
            case 'hard':
                columns = 'repeat(6, 1fr)';
                break;
            default:
                columns = 'repeat(3, 1fr)';
        }
        gameBoard.style.gridTemplateColumns = columns;
        
        // Create shuffled symbols array based on difficulty
        let numCards = totalPairs * 2;
        
        // Shuffle the symbols first, then take what we need
        let shuffledSymbols = [...symbols];
        shuffleArray(shuffledSymbols);
        
        let gameSymbols = shuffledSymbols.slice(0, totalPairs);
        cards = [...gameSymbols, ...gameSymbols];
        shuffleArray(cards);
        
        // Create card elements
        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front"></div>
                    <div class="card-back">
                        <span class="icon">${symbol}</span>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => flipCard(card, index));
            gameBoard.appendChild(card);
        });
        
        winModal.style.display = 'none';
    }
    
    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Handle card flip
    function flipCard(card, index) {
        // Don't allow flipping if processing, already flipped, or matched
        if (isProcessing || flippedCards.length >= 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        // Start timer on first card flip
        if (!gameStarted) {
            startTimer();
            gameStarted = true;
        }
        
        // Flip the card
        card.classList.add('flipped');
        flippedCards.push({ card, index });
        
        // Check for a match if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            movesElement.textContent = moves;
            
            const [card1, card2] = flippedCards;
            const isMatch = cards[card1.index] === cards[card2.index];
            
            if (isMatch) {
                // Handle match
                card1.card.classList.add('matched');
                card2.card.classList.add('matched');
                flippedCards = [];
                matchedPairs++;
                matchesElement.textContent = `${matchedPairs} / ${totalPairs}`;
                
                // Check if game is won
                if (matchedPairs === totalPairs) {
                    endGame();
                }
            } else {
                // Handle non-match
                isProcessing = true;
                setTimeout(() => {
                    card1.card.classList.remove('flipped');
                    card2.card.classList.remove('flipped');
                    flippedCards = [];
                    isProcessing = false;
                }, 1000);
            }
        }
    }
    
    // Timer functions
    function startTimer() {
        clearInterval(timer);
        seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
            const secs = (seconds % 60).toString().padStart(2, '0');
            timerElement.textContent = `${mins}:${secs}`;
        }, 1000);
    }
    
    function formatTime(timeInSeconds) {
        const mins = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
        const secs = (timeInSeconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
    
    // Handle game end
    function endGame() {
        clearInterval(timer);
        finalTimeElement.textContent = formatTime(seconds);
        finalMovesElement.textContent = moves;
        
        // Show modal with slight delay for satisfaction
        setTimeout(() => {
            winModal.style.display = 'flex';
        }, 500);
    }
    
    // Update difficulty settings and start game
    function setDifficulty(diff) {
        difficulty = diff;
        
        switch(difficulty) {
            case 'easy':
                totalPairs = 3;
                break;
            case 'medium':
                totalPairs = 6;
                break;
            case 'hard':
                totalPairs = 12;
                break;
        }
        
        // Initialize the game
        initGame();
        
        // Show game screen and hide selection screen
        selectionScreen.style.display = 'none';
        gameScreen.style.display = 'block';
    }
    
    // Show selection screen
    function showSelectionScreen() {
        // Clear any ongoing game
        clearInterval(timer);
        
        // Hide game screen and show selection screen
        gameScreen.style.display = 'none';
        selectionScreen.style.display = 'block';
        
        // Hide win modal if it's open
        winModal.style.display = 'none';
    }
    
    // Event listeners
    easyLevel.addEventListener('click', () => setDifficulty('easy'));
    mediumLevel.addEventListener('click', () => setDifficulty('medium'));
    hardLevel.addEventListener('click', () => setDifficulty('hard'));
    
    restartBtn.addEventListener('click', () => initGame());
    homeBtn.addEventListener('click', () => showSelectionScreen());
    
    playAgainBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        initGame();
    });
    
    backToMenuBtn.addEventListener('click', () => {
        winModal.style.display = 'none';
        showSelectionScreen();
    });
    