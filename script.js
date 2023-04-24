const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');
const signOver = document.getElementById('signOver');
const signStart = document.getElementById('signStart');

class Simon {
    constructor(simonButtons, startButton, signOver, signStart) {
        this.level = 0;
        this.userPosition = 0;
        this.totalLevels = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = {
            startButton,
            signOver,
            signStart
        }
        this.errorSound = new Audio('./sounds/sounds_error.wav');
        this.buttonSounds = [
            new Audio('./sounds/sounds_1.mp3'),
            new Audio('./sounds/sounds_2.mp3'),
            new Audio('./sounds/sounds_3.mp3'),
            new Audio('./sounds/sounds_4.mp3'),
        ]
    }

    // Inicia el Simon
    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    // Comienza el juego
    startGame() {
        this.display.signStart.style.display = 'none';
        this.updateLevel(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    // Actualiza el nivel
    updateLevel(value) {
        this.level = value;
        this.display.signOver.textContent = `Level ${this.level}`;
        this.display.signOver.style.display = 'block';
        clearInterval(this.levelInterval);
        this.levelInterval = setInterval(() => {
            this.display.signOver.style.display = 'none';
        }, 1000);
    }

   // Crea toda la secuencia del juego
   createSequence() {
        return Array.from({length: this.totalLevels}, () =>  Math.floor(Math.random() * 4));
    }

    // Ejecuta una función cuando se hace click en un botón
    buttonClick(value) {
        !this.blockedButtons && this.validateChosenColor(value);
    }

    // Valida si el boton que toca el usuario corresponde a al valor de la secuencia
    validateChosenColor(value) {
        if(this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if(this.level === this.userPosition) {
                this.updateLevel(this.level + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.gameLost();
        }
    }

    // Verifica que no haya acabado el juego
    isGameOver() {
        if (this.level === this.totalLevels) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        };
    }

    // Muestra la secuencia de botones que va a tener que tocar el usuario
    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            button.classList.toggle('active');
            setTimeout( () => button.classList.toggle('active'), this.speed / 2)
            sequenceIndex++;
            if (sequenceIndex > this.level) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    // Actualiza el simon cuando el jugador pierde
    gameLost() {
        this.errorSound.play();
        this.blockedButtons = true;
        this.display.signOver.textContent = 'Game Over';
        this.display.signOver.style.display = 'block';
    }

    // Muestra la animacón de triunfo y actualiza el simon cuando el jugador gana
    gameWon() {
        this.blockedButtons = true;
        this.buttons.forEach(element =>{
            element.classList.add('winner');
        });
        this.display.signOver.textContent = 'You Win';
        this.display.signOver.style.display = 'block';
    }
}

const simon = new Simon(simonButtons, startButton, signOver, signStart);
simon.init();