<h3 align="center">  

╭━━━┳━━━┳━━━━┳━━━╮╭━╮╭━┳━━━┳━━━┳╮╱╭╮
╰╮╭╮┃╭━╮┃╭╮╭╮┃╭━╮┃┃┃╰╯┃┃╭━╮┃╭━╮┃┃╱┃┃
╱┃┃┃┃┃╱┃┣╯┃┃╰┫┃╱┃┃┃╭╮╭╮┃┃╱┃┃╰━━┫╰━╯┃
╱┃┃┃┃╰━╯┃╱┃┃╱┃╰━╯┃┃┃┃┃┃┃┃╱┃┣━━╮┃╭━╮┃
╭╯╰╯┃╭━╮┃╱┃┃╱┃╭━╮┃┃┃┃┃┃┃╰━╯┃╰━╯┃┃╱┃┃
╰━━━┻╯╱╰╯╱╰╯╱╰╯╱╰╯╰╯╰╯╰┻━━━┻━━━┻╯╱╰╯

</h3>
<div align="center">
<img src="https://github.com/MaxBrockbank.png" width="200px" height="auto" >
</div>
<p align="center">Authored by Max Brockabnk</p>
<p align="center">Updated on March 10th, 2021</p>

# Description

Welcome to Data Mosh! An audio visualizer to take your music listening experience to the next level. Currently there are two vizualization experiences to choose from, the ability to adjust the color of the visuals, and a song selection pulled from a custom Firebase Database.



## Minimum Viable Product
* A sleek, minimual UI
* A firebase database of audio files
* Reactive animation to selected music file


## Required Technologies
* Modern Web Browser
* Text Editor
* NodeJS / NPM

## Set-up Instructions
1. Click on the green `Code` button and copy the URL that shows up.
2. Open up your computer's terminal and navigate to the desktop directory `cd Desktop` or any other directory you'd like the project to live in. 
3. Open this project in your text editor.
4. In the terminal navigate to the project's root directory and install node_modules with the command `npm i`.
5. Next you'll have to set up a project with Google Firebase. Click [here](https://firebase.google.com/docs/web/setup) to see how.
6. Once you have set up your Firebase project, go to the Firebase console, and navigate to the `Storage` page. Here you will create a new folder called `mp3Files` and in it you'll put your audio files.

7. Then you'll want to go to the `Project Settings` and find the code snippet with the object `firebaseConfig`. You'll creat an `.env` file in the root directory of the project, and each of the string values you will put in the file with a variable name starting with `REACT_APP_FIREBASE`. 
```
Example:

REACT_APP_FIREBASE_API_KEY = (your api key string here)
```
8. Before you are able to actually pull and use the audio files from your Firebase Storage, you will need to adjust the CORS rules for the bucket. Click [here](https://cloud.google.com/storage/docs/configuring-cors) to see how. I used the gsutil CLI mentioned in those instructions. The link for the gsutil CLI install instructirions is [here](https://cloud.google.com/storage/docs/gsutil_install).
9. Finally to build and start the development server and view the project run the command `npm start`.

## Technologies Used
* JavaScript / React
* React-Bootstrap
* CSS
* Firebase 
* Canvas API
* Web Audio API

## Component Diagram
<img src="READMEAssets/componentDiagram.jpg" alt="Data Mosh Component Diagram">

## Known Bugs

## Legal
* Copyright © 2020 Max Brockbank
* This software is licensed under the MIT license
