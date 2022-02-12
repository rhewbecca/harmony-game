const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

const frequencies = [
    [440.00, 880.00, 1760.00, 3520.00],
    [466.16, 932.33, 1864.66, 3729.31],
    [493.88, 987.77, 1975.53, 3951.07],
    [523.25, 1046.50, 2093.00, 4186.01],
    [554.37, 1108.73, 2217.46, 4434.92],
    [587.33, 1174.66, 2349.32, 4698.63],
    [622.25, 1244.51, 2489.02, 4978.03],
    [659.25, 1318.51, 2637.02, 5274.04],
    [698.46, 1396.91, 2793.83, 5587.65],
    [739.99, 1479.98, 2959.96, 5919.91],
    [783.99, 1567.98, 3135.96, 6271.93],
    [830.61, 1661.22, 3322.44, 6644.88]
]

const distances = [["ionian",    [2,2,1,2,2,2,1]],
                   ["dorian",    [1,2,2,1,2,2,2]],
                   ["phrygian",  [2,1,2,2,1,2,2]],
                   ["lydian",    [2,2,1,2,2,1,2]],
                   ["mixolydian",[2,2,2,1,2,2,1]],
                   ["aeolian",   [1,2,2,2,1,2,2]],
                   ["locrian",   [2,1,2,2,2,1,2]]]

const firebaseConfig = {
    apiKey: "AIzaSyCbrwtBDz-tE3io_qU-TazOuCsWdzDafBg",
    authDomain: "rhapsodizer-703a1.firebaseapp.com",
    projectId: "rhapsodizer-703a1",
    storageBucket: "rhapsodizer-703a1.appspot.com",
    messagingSenderId: "499657467111",
    appId: "1:499657467111:web:9ed371301b9e160def2e42"
}
//Initalize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

//Initialize Audio
const c = new AudioContext()

// Global functions:----------------------------------------------------------------------

//Play note of shifted "notes" array (shifting based on first note of scale)
function play(note, fundamental) {
    const attack = 0.01;
    const release = 0.2;
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
    //Using IIFE Immediately invoked function expression
    for (i=0; i<7; i++){
        (function(val) {
            setTimeout(function () {play(scale[val], scale[0])}, 270*val)
        })(i);
    }
}

// Intended for shifting "notes" array
function shiftArray(index) {
    // Index must be a string
    if (isNaN(index)) {
        toShift = [...notes]
        f = toShift.indexOf(index)
        for (i=0; i<f; i++) {
            toShift.push(toShift[i])
            toShift[i] = "not"
        }
        shifted = toShift
    }
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
            games: ['Guess Note', 'Guess Scale', 'Reorder Notes'],
            score: 0,
            leaderboard: true,
            scoreList: [3,5,6]
        }
    },
    methods: {
        sendScore(){
            db.collection("guessNote").add({"name": document.getElementById("name").value, "score": this.score})
            document.getElementById("name").value = null
            this.score = null
        },
        updateMain(e){
            this.score = e
            console.log(this.score)
        }
    },
    template: `
        <h1> GAMES: <button v-for='game in games' @click="currentPage = game">{{ game }}</button></h1>
        <div id="game">
            <div v-if="score">
                Name:<input type="text" id="name">
                Score: {{ score }}
                <button @click="sendScore">Send</button>
                <div id="leaderboard" v-if="leaderboard">
                    Leader Board
                    <ol>
                        <li v-for="item in scoreList">{{ item }}</li>
                    </ol>
                </div>
            </div>
            <component :is='currentPage' @sendScore="updateMain"/>
        </div>
    `
})

app.component('Guess Note', {
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
            questionsNumberDone: 0,

            checked: false,
            hint: false
        }
    },
    emits: ['sendScore'],
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
            for (i=0; i<6; i++){
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
                this.$emit('sendScore', this.score)
            }

            // Wait before next scale
            setTimeout(this.generateScale, 1500)
        },
        resetGame() {
            this.score = 0
            this.questionsNumberDone = 0
            this.$emit('sendScore', null)
        },
    },
    template: `
        <div>
            <h2><button @click="started=true; resetGame(); generateScale()">New game</button></h2>
            <h3><div v-if="started==true"> Question {{ questionsNumberDone }} Score: {{ score }}/{{ questionsNumberTot }}</div></h3>
        </div>
        <div v-if="started">
            <button1 v-for="note in generatedScale">{{ note }}</button1>
            <h4><button v-for="guess in generatedAnswers" v-on:click="checkAnswer(guess)">{{ guess }}</button>
            <button v-if="questionsNumberDone < questionsNumberTot" @click="generateScale(); questionsNumberDone += 1">Skip</button>
            <button onclick="playScale()">Listen scale</button>
            <button id="hint" @click="this.hint = true">{{hint ? generatedScaleName : 'Hint'}}</button></h4>
            <div><PianoKeyboard></PianoKeyboard></div>
            <div><input type="checkbox" v-model="checked">Use mic</div>
        </div>
        <visualizer v-if="checked" @sendAnswer=checkAnswer></visualizer>
    `
})

app.component('Guess Scale', {
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
            for (i=0; i<6; i++){
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
            <h2><button @click="started=true; resetGame(); generateScale()">New game</button></h2>
            <h3><div v-if="started==true">Question {{ questionsNumberDone }} Score: {{ score }}/{{ questionsNumberTot }}</div></h3>
        </div>
        <div v-if="started">
            <button1 v-for="note in generatedScale">{{ note }}</button1>
            <h4><button v-for="guess in generatedAnswers" v-on:click="checkAnswer(guess)">{{ guess }}</button></h4>
            <button v-if="questionsNumberDone < questionsNumberTot" @click="generateScale(); questionsNumberDone += 1">Skip</button>
            <button onclick="playScale()">Listen scale</button>
            <div><PianoKeyboard></PianoKeyboard></div>
        </div>
    `
})

app.component('Reorder Notes', {
    data() {
        return{
            scale: null,
            generatedScale: null,
            generatedScaleName: null,
            started: false,
            score: 0,
            questionsNumberTot: 10,
            questionsNumberDone: 0,
            clicked: false,
            firstNote: null,
            secondNote: null,
            moves: 0,
            hint: false
        }
    },
    methods: {
        generateScale() {
            this.questionsNumberDone +=1
            this.randomScale()
            this.generatedScale = shuffle([...this.scale])
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
            for (i=0; i<6; i++){
                index += typeDist[i]
                scale.push(list[f_index + index])
            }
            this.scale = scale
            // Debug
            console.log(this.scale)
        },
        checkAnswer() {
            // Check if correct or not
            if (this.generatedScale.every(function(el, idx){return el == this.scale[idx]})) {
                playScale()
                // All questions completed
                if(this.questionsNumberDone == this.questionsNumberTot){
                    alert("Total score: " + this.score + "/" + this.questionsNumberTot)
                    this.started = false
                }
                // Wait before next scale
                setTimeout(this.generateScale, 1500)
            }
        },
        resetGame() {
            this.score = 0
            this.questionsNumberDone = 0
            this.moves = 0
        },
        swap(el) {
            if (this.clicked == true){
                this.secondNote = el
                document.getElementById(this.secondNote).style.backgroundColor = "yellow"
                a = this.generatedScale.indexOf(this.firstNote)
                b = this.generatedScale.indexOf(this.secondNote)
                this.generatedScale[a] = this.secondNote
                this.generatedScale[b] = this.firstNote
                this.clicked = false
                this.moves += 1
                clear(this.firstNote, this.secondNote)
                this.checkAnswer()
            } else {
                this.clicked = true
                this.firstNote = el
                document.getElementById(this.firstNote).style.backgroundColor = "yellow"
            }

            function clear(firstNote,secondNote) {
                setTimeout(function(){
                    document.getElementById(firstNote).style.backgroundColor = null;
                    document.getElementById(secondNote).style.backgroundColor = null;
                }, 400)

            }
        }
    },
    template: `
    <div>
        <h2><button @click="started=true; resetGame(); generateScale()">New game</button></h2>
        <div v-if="started==true">Question {{ questionsNumberDone }} Score: {{ score }}/{{ questionsNumberTot }}</div>
        <div v-if="started==true">Moves: {{ moves }}</div>
    </div>
    <div v-if="started">
        <div class="draggable" v-for="note in generatedScale" v-bind:id="note" @click="swap(note)">{{ note }}</div>
        <button onclick="playScale()">Listen scale</button>
        <button v-if="questionsNumberDone < questionsNumberTot" @click="generateScale(); questionsNumberDone += 1">Skip</button>
        <button id="hint" @click="this.hint = true">{{hint ? generatedScaleName : 'Hint'}}</button>
        <div><PianoKeyboard></PianoKeyboard></div>
    </div>
    `
})

app.component('PianoKeyboard', {
    data(){
        return{
            
        }
    },
    methods: {
        
    },
    template: `
        <ul id="keyboard">
        <li note="C" class="white">C</li>
        <li note="C#" class="black">C#</li>
        <li note="D" class="white offset">D</li>
        <li note="D#" class="black">D#</li>
        <li note="E" class="white offset">E</li>
        <li note="F" class="white">F</li>
        <li note="F#" class="black">F#</li>
        <li note="G" class="white offset">G</li>
        <li note="G#" class="black">G#</li>
        <li note="A" class="white offset">A</li>
        <li note="A#" class="black">A#</li>
        <li note="B" class="white offset">B</li>
        <li note="C2" class="white">C2</li>
        <li note="C#2" class="black">C#2</li>
        <li note="D2" class="white offset">D2</li>
        <li note="D#2" class="black">D#2</li>
        <li note="E2" class="white offset">E2</li>
    </ul>
    `
})

app.component('visualizer', {
    data() {
        return{
            note: "-",
            dataArray: null,
            analyser: null,
            canvas: null,
            bufferLength: 0,
            bin_range: null
        }
    },
    emits: ['sendAnswer'],
    async mounted() {

        //Can await beause it's an async function
        var stream = await navigator.mediaDevices.getUserMedia({audio:true});
        //Media stream source
        var mss = c.createMediaStreamSource(stream);

        this.canvas = document.getElementById("freq");
        ctx = this.canvas.getContext("2d");

        this.analyser = c.createAnalyser();
        this.analyser.fftSize = 1024;
        this.analyser.smoothingTimeConstant = 0.95;

        mss.connect(this.analyser)

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Float32Array(this.bufferLength);
        // Calculate frequency bin range
        this.bin_range = c.sampleRate/this.analyser.fftSize

        this.draw()

    },
    methods: {
        draw() {

            //Get spectrum data
            this.analyser.getFloatFrequencyData(this.dataArray)

            //Get pitch
            this.note = this.getPitch(this.dataArray)
            if (this.note != null) {
                console.log(this.note)
            }

            //Draw background
            //ctx.fillStyle = 'rgb(255, 255, 255)' //white
            ctx.fillStyle = 'rgb(245, 227, 227)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

            //Draw spectrum
            const barWidth = (this.canvas.width / this.bufferLength) * 2.5
            let posX = 0;
            for (let i = 0; i < this.bufferLength; i++) {
              const barHeight = (this.dataArray[i] + 140) * 2
              ctx.fillStyle = 'rgb(0, 0, 0)'
              ctx.fillRect(posX, this.canvas.height - barHeight / 2, barWidth, barHeight / 2)
              posX += barWidth + 1
            }
            //Schedule next redraw
            requestAnimationFrame(this.draw)
        },
        getPitch(array) {
           max = Math.max(...array)
           idx = array.indexOf(max)
           freqMax = idx*this.bin_range
           freqMin = freqMax - this.bin_range
           note = null
           for (i=0; i<12; i++) {
               for (k=0; k<5; k++) {
                   if (frequencies[i][k]>=freqMin && frequencies[i][k]<freqMax) {
                       note = notes[i]
                   }
               }
           }
           return note
       }
    },
    template: `
        <canvas id="freq"></canvas>
        <button @click="this.$emit('sendAnswer', this.note)">Capture answer {{ note }}</button>
    `
})


// Mount App
const mountedApp = app.mount('#app')