# HARMONY GAME

[![forthebadge](http://forthebadge.com/images/badges/made-with-javascript.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/made-with-vue.svg)](http://forthebadge.com)
[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)

This is a project for ACTAM course in Politecnico di Milano.
It's a simple VueJS application containing some games concerning music.

 ![image](https://user-images.githubusercontent.com/17109060/32149040-04f3125c-bd25-11e7-8003-66fd29bc18d4.png)

# Table of contents

- [About](#about)
- [Installation](#installation)
- [Features](#features)
- [Structure](#structure)
- [Custom configurations](#custom-configurations)
- [Future improvements](#future-improvements)
- [License](#license)

# About

[(Back to top)](#table-of-contents)

This is a project for ACTAM course in Politecnico di Milano. It's a collection of mini games related to music (by now 3 games).
Its purpose is to implement a real application experimenting with WebAudio API, Firebase, VueJs and WebMIDI API. 


# Installation

[(Back to top)](#table-of-contents)

No need to install. You can download .zip folder and run inside any recent browser supporting WebAudioAPI.

If you want to run this app without an internet connection you need to change Vue and Firebase initialization as [shown below](#custom-configurations).

# Features

[(Back to top)](#table-of-contents)

### MODULARITY:
VueJs framework allows you to extend the application with new games, new input methods, new widgets and functions.
### HARMONY:
The content of the games concerns the harmonic part of music, in particular the recognition of notes and scales. This can be extended to other aspects.
### INPUT METHODS:
The game "Guess Note" allows you to choose different input methods to give answers: a traditional four-guesses template, a little beautiful onscreen keyboard, a MIDI device and even a microphone!
### PITCH RECOGNITION:
If you choose your mic as input method you can see a real-time frequency spectrogram and capture your answer. You can play an instrument or sing the note or whistle!


# Structure

[(Back to top)](#table-of-contents)

File `main.js` contains the Vue core and general functions called by different components.

`mainmenu` is the main component of the app and it's a container for different games.

Each game is a component itself, with its variables (`data`), pricate functions (`methods`) and HTML structure (`template`).
Game components communicate with mainmenu, passing variables like scores. Child to parent communication in VueJS take place with an emitter object inside child and
a listener inside parent.

<pre>
main.js, index.html, main.css
   |
   |
   |----general functions
   |
   |----mainmenu-------------------------------------------------------------< [listener]       <----|  <----|
   |                |         |            |           |                                             |       |
   |                data      [mounted]    methods     template                                      |       |
   |                                                                                                 |       |
   |                                                                                                 |       |
   |----game1-----------------------------------------------------> [emitter]........................|       |
   |                |         |            |           |                                                     |
   |                data      [mounted]    methods     template                                              |
   |                                                                                                         |
   |----game2-----------------------------------------------------> [emitter]................................|
   |                |         |            |           |
   |                data      [mounted]    methods     template
   |---- ...
</pre>

### Components

[(Back to top)](#table-of-contents)

- `mainmenu` : It's the main component of the application, directly loaded inside the main app in `index.html`. It's the main parent and works as a container for every loaded game

- `Guess Note` : 1st game. The goal is to guess the missing note from a list of seven, which represent a full scale. To help the user there is a "hint" button which shows the name of the specific scale. Microphone or an onscreen keyboard can also be chosen as the input method. You can always skip the question and listen to the scale.

- `Guess Scale` : 2nd game. The goal is to guess the scale from a list of seven notes, which represent a full scale. You can always skip the question and listen to the scale.

- `Reorder Notes` : 3rd game. The goal is to reorder the seven notes of a given scale, swapping two notes a time. You can always skip the question and listen to the scale.

- `PianoKeyboard` : little keyboard widget. It can be used as input for `Guess Note` game.

- `visualizer` : frequency spectrum widget. It can be used as input for `Guess Note` game. You can play a real instrument or whistle the note to the microphone. The note will be recognized and you can answer clicking on "CAPTURE ANSWER" when a note is recognized.

- `midiInput` : empty widget, contains methods for MIDI API. It can be used as input for `Guess Note` game.



### Global functions

- `function play(note, fundamental)` : play single tone in respect to the fundamental (based on the scale)

- `function playScale()` : play the seven notes of a given scale

- `function shiftArray(index)` : shift `notes` array by fundamental

- `function shuffle(array)` : randomize an array, used for randomizing answers and notes in "Reorder Note" games. Fisher-Yates Shuffle

### Relevant functions inside components

- `randomScale()` : retrive random scale using `notes` and `distances` arrays

- `generateAnswers()` : generate possible answers using `notes` and `distances` arrays

- `checkAnswer(e)` : check if given answer is correct or not

- `showLeaderBoard()` : show or hide leaderboard

- `swap(e)` : important method for "Reorder Notes" game. Swap position of two clicked notes

- `getPitch(array)` : analyze frequencies coming from mic and compare them with `frequencies` array. Low level work is done by `analyzer` node in WebAudio API

- `draw()` : draw frames to visualize spectrum from mic in real-time

- `getMIDIMessage(message)` : get a MIDI message and return the corresponding note (for example: 60 => "C")



# Custom configurations

[(Back to top)](#table-of-contents)

You can change very few lines of code in order to make this app your own. However limitation may apply, specifically version of external libraries.

- To use different firebase script reference:

  This app uses `Firebase 8.0.0`. You can use a different version by changing following line in `index.html`:

  ```
  <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase.js"></script>
  ```

- To use your own firebase database :

  In `main.js` file, you need to change firebase configuration `firebaseConfig` with your own attributes.

  ```
  const firebaseConfig = {
    apiKey: "AIzaSyCbrwtBDz-tE3io_qU-TazOuCsWdzDafBg",
    authDomain: "rhapsodizer-703a1.firebaseapp.com",
    projectId: "rhapsodizer-703a1",
    storageBucket: "rhapsodizer-703a1.appspot.com",
    messagingSenderId: "499657467111",
    appId: "1:499657467111:web:9ed371301b9e160def2e42"
   }
  ```

 - To use local VueJS installation :

   This app uses `Vue 3`. Using Vue 2 will break the app. You can use a different path by changing following line inside `index.html`:

   ```
   <script src="https://unpkg.com/vue@next"></script>
   ```    

# Future improvements

[(Back to top)](#table-of-contents)

- adding new games
- adding algorythms for chords
- improving layout
- improve error handling

# License

[(Back to top)](#table-of-contents)

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,!
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF!
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.!
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY!
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,!
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE!
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

2022 - [Rhapsodizer](https://github.com/Rhapsodizer/) and [rhewbecca](https://github.com/rhewbecca/)

Contact us for more informations


