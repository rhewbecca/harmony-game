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
