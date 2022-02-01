const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

const c = new AudioContext()
var attack = 0.01;
var release = 0.2;

function play(note, fundamental) {
    i = shiftArray(fundamental).indexOf(note)
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = 440*Math.pow(2, i/12);
    o.connect(g);
    g.connect(c.destination);
    const now = c.currentTime;
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(1, now + attack)
    g.gain.linearRampToValueAtTime(0, now + attack + release)
    o.start();
    o.stop(now + attack + release);
}

function playScale() {
    //IIFE Immediately invoked function expression
    for (i=0; i<7; i++){
        (function(val) {
            setTimeout(function () {play(scale[val], scale[0])}, 200*val)
        })(i);
    }
}

function shiftArray(fundamental) {
    toShift = [...notes]
    f = toShift.indexOf(fundamental)
    for (i=0; i<f; i++) {
        toShift.push(toShift[i])
        toShift[i] = "not"
    }
    shifted = toShift
    //shifted = toShift.splice(f, toShift.length)

    return shifted
}


//main app
const app = Vue.createApp({})

app.component('mainmenu', {
    data() {
        return{
            currentPage: null,
            games: ['guessnote', 'guessscale', 'reorderscale', '...']
        }
    },
    template: `
        <div id="taskbar"></div>
        <div>Available games: <button v-for='game in games' @click="currentPage = game">{{ game }}</button></div>
        <component :is='currentPage' />
        <div id="game"></div>
    `
})

app.component('guessnote', {
    data() {
        return{
            generatedScale: null,
            generatedAnswers: null,
            correctAnswer: null,
            started: false,
            score: 0,
            questionsNumberTot: 10,
            questionsNumberDone: 0
        }
    },
    methods: {
        generateScale() {
            this.questionsNumberDone +=1
            this.generatedScale = [...scale]
            var pos = Math.floor(Math.random()*7)
            this.correctAnswer = this.generatedScale[pos]
            this.generatedScale[pos] = '_'
            this.generateAnswers()
        },
        generateAnswers() {
            const notes_tmp = [...notes].filter(x => scale.indexOf(x) === -1)
            const generatedAnswers = [this.correctAnswer]
            while (generatedAnswers.length<4){
                var el = notes_tmp[Math.floor(Math.random()*5)]
                if ((new Set(generatedAnswers)).has(el)){
                    continue
                } else {
                    generatedAnswers.push(el)
                }
            }
            this.generatedAnswers = shuffle(generatedAnswers)
        },
        checkAnswer(e) {
            // Check if correct or not
            if(e == this.correctAnswer){
                this.correct = true
                this.score += 1
                // Show complete correct scale
                this.generatedScale = [...scale]
                playScale()
                //alert("Correct!")
            } else {
                alert("You died! Correct answer is " + this.correctAnswer)
            }

            // All questions completed
            if(this.questionsNumberDone == this.questionsNumberTot){
                alert("Total score: " + this.score + "/" + this.questionsNumberTot)
                this.started = false
            }

            // Wait before next scale
            setTimeout(this.generateScale, 1000)
        },
        resetGame() {
            this.score = 0
            this.questionsNumberDone = 0
        }
    },
    template: `
        <div>
            <button @click="started=true; resetGame(); generateScale()">New game</button>
            <div v-if="started==true">Question {{ questionsNumberDone }} Score: {{ score }}/{{ questionsNumberTot }}</div>
        </div>
        <div v-if="started">
            <div v-for="note in generatedScale">{{ note }}</div>
            <button v-for="guess in generatedAnswers" v-on:click="checkAnswer(guess)">{{ guess }}</button>
            <button v-on:click="generateScale; questionsNumberDone += 1">Skip</button>
            <button onclick="playScale()">Listen scale</button>
        </div>
    `
})

// Fisher-Yates (aka Knuth) Shuffle
// Global function
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Mount App
const mountedApp = app.mount('#app')
