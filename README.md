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
- [File Structure](#flie-structure)
- [Custom configurations](#custom-configurations)
- [Contributing](#contributing)
- [License](#license)

# About

[(Back to top)](#table-of-contents)

This is a project for ACTAM course in Politecnico di Milano.


# Installation

[(Back to top)](#table-of-contents)

No need to install. You can download .zip folder and run inside any recent browser supporting WebAudioAPI.

If you want to run this app without an internet connection you need to change Vue and Firebase initialization as shown below.

# Features

[(Back to top)](#table-of-contents)

## MODULARITY:
VueJs framework allows you to extend the application with new games, new input methods, new widgets and functions.
## HARMONY:
The content of the games concerns the harmonic part of music, in particular the recognition of notes and scales. This can be extended to other aspects.
## INPUT METHODS:
The game "Guess Note" allows you to choose different input methods to give answers: a traditional four-guesses template, a little beautiful keyboard and even a microphone!
## PITCH RECOGNITION:
If you choose your mic as input method you can see a real-time frequency spectrogram


# Custom configurations

[(Back to top)](#table-of-contents)

You can overwrite the existing icons and colors mapping by copying the yaml files from `$(dirname $(gem which colorls))/yaml` into `~/.config/colorls`, and changing them.

- To use different firebase script reference:

  This app uses `Firebase 8.0.0`. You can use a different version by changing following line in `index.html`:

  ```
  <script src="https://www.gstatic.com/firebasejs/8.0.0/firebase.js"></script>
  ```

- To use your own firebase database :

  In`main.js` file, you need to change firebase configuration `firebaseConfig` with your own attributes.

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

# Contributing

[(Back to top)](#table-of-contents)


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





# harmony-game

<p><h1> About </h1></p>

This is a project for ACTAM course in Politecnico di Milano.
It's a simple VueJS application containing some games concerning music.

<p><h1> Features </h1></p>

<ul>
<li><b>MODULARITY:</b> VueJs framework allows you to extend the application with new games, new input methods, new widgets and functions
<li><b>HARMONY:</b> The content of the games concerns the harmonic part of music, in particular the recognition of notes and scales.This can be extended to other aspects
<li><b>AUDIO:</b> The WebAudio API are used extensively and a microphone can be used as input device
</ul>

<p><h1> Structure </h1></p>

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
File "main.js" contains the Vue core and general functions called by different components.
"mainmenu" is the main component of the app and it's a container for different games.
Each game is a component itself, with its variables (data), pricate functions (methods) and HTML structure (template).
Game components communicate with mainmenu, passing variables like scores. Child to parent communication in VueJS take place with an emitter object inside child and
a listener inside parent.
