const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
//const scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const distances = [["ionian",    [2,2,1,2,2,2,1]],
                   ["dorian",    [1,2,2,1,2,2,2]],
                   ["phrygian",  [2,1,2,2,1,2,2]],
                   ["lydian",    [2,2,1,2,2,1,2]],
                   ["mixolydian",[2,2,2,1,2,2,1]],
                   ["aeolian",   [1,2,2,2,1,2,2]],
                   ["locrian",   [2,1,2,2,2,1,2]]]

const c = new AudioContext()
var attack = 0.01;
var release = 0.2;

// Global functions:----------------------------------------------------------------------

//Play note of shifted "notes" array (shifting based on first note of scale)
function play(note, fundamental) {
    i = shiftArray(fundamental).indexOf(note)
    const o = c.createOscillator();
    const g = c.createGain();
    o.frequency.value = 220*Math.pow(2, i/12);
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

// Intended for shifting "notes" array
function shiftArray(index) {
    // to shift "notes" array
    if (isNaN(index)) {
        toShift = [...notes]
        f = toShift.indexOf(index)
        for (i=0; i<f; i++) {
            toShift.push(toShift[i])
            toShift[i] = "not"
        }
        shifted = toShift
    }
    //to shift any array
    // else {
    //     for (i=0; i<index; i++) {
    //         toShift.push(toShift[i])
    //     }
    // shifted = toShift.splice(index, toShift.length)
    // }

    return shifted
}

// Fisher-Yates (aka Knuth) Shuffle
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

//------------------------------------------------------------------------------------------

//main app
const app = Vue.createApp({})

app.component('mainmenu', {
    data() {
        return{
            currentPage: null,
            games: ['guessnote', 'guessscale', 'reorderscale']
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
            scale: null,
            generatedScale: null,
            generatedScaleName: null,
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
            this.randomScale()
            this.generatedScale = [...this.scale]
            var pos = Math.floor(Math.random()*7)
            this.correctAnswer = this.generatedScale[pos]
            this.generatedScale[pos] = '_'
            this.generateAnswers()
        },
        randomScale() {
            scale = []
            //Random starting note
            f_index = Math.floor(Math.random()*12)
            fundamental = notes[f_index]
            //Random scale type
            r = Math.floor(Math.random()*7)
            this.generatedScaleName = distances[r][0]
            typeDist = distances[r][1]
            //Build scale
            list = shiftArray(fundamental)
            scale[0] = fundamental
            index = 0
            for (i=0; i<7; i++){
                index += typeDist[i]
                scale.push(list[f_index + index])
            }
            this.scale = scale
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
                this.generatedScale = [...this.scale]
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
            setTimeout(this.generateScale, 1500)
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
            <button v-if="questionsNumberDone < questionsNumberTot" @click="generateScale(); questionsNumberDone += 1">Skip</button>
            <button onclick="playScale()">Listen scale</button>
            <button>Hint: {{ generatedScaleName }}</button>
        </div>
    `
})

app.component('guessscale', {
    data() {
        return{
            scale: null,
            generatedScale: null,
            generatedScaleName: null,
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
            this.randomScale()
            this.generatedScale = [...this.scale]
            this.generateAnswers()
        },
        randomScale() {
            scale = []
            //Random starting note
            f_index = Math.floor(Math.random()*12)
            fundamental = notes[f_index]
            //Random scale type
            r = Math.floor(Math.random()*7)
            this.generatedScaleName = distances[r][0]
            typeDist = distances[r][1]
            //Build scale
            list = shiftArray(fundamental)
            scale[0] = fundamental
            index = 0
            for (i=0; i<7; i++){
                index += typeDist[i]
                scale.push(list[f_index + index])
            }
            this.scale = scale
        },
        generateAnswers() {
            const generatedAnswers = [this.generatedScaleName]
            while (generatedAnswers.length<4){
                var el = distances[Math.floor(Math.random()*5)][0]
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
            if(e == this.generatedScaleName){
                this.correct = true
                this.score += 1
                // Show complete correct scale
                this.generatedScale = [...this.scale]
                playScale()
                //alert("Correct!")
            } else {
                alert("You died! Correct answer is " + this.generatedScaleName)
            }

            // All questions completed
            if(this.questionsNumberDone == this.questionsNumberTot){
                alert("Total score: " + this.score + "/" + this.questionsNumberTot)
                this.started = false
            }

            // Wait before next scale
            setTimeout(this.generateScale, 1500)
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
            <button v-if="questionsNumberDone < questionsNumberTot" @click="generateScale(); questionsNumberDone += 1">Skip</button>
            <button onclick="playScale()">Listen scale</button>
        </div>
    `
})

// Mount App
const mountedApp = app.mount('#app')
