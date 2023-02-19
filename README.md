# Post-Socket Guessing Game
## A short-kahoot like game designed to be used as a learning resource for POST-requests and Socket.io connections to a server with an accompanying react-frontend.
Like a sort of challenge, the point is to have users make a front-end that has the capabilities to either A) send question answers to the server using POST-requests or B) Send question answers to the server using Socket.io

![image](https://user-images.githubusercontent.com/66651087/219981001-1ee585d2-b402-43c6-b620-96b5fd55e88a.png)

## Installation
Run from httpserver folder AND reactapp folder.
```
npm i
```
Once installed, run 
```
npm run build
```
This will generate the built react project, and can then be placed in the httpserver folder, where Express will host the react-project.

Run the server:
```
node server.js
```
Now you should see the Post-Socket Guessing Game frontend if you go to http://localhost:3000.
Using Postman, verify that the server takes your post-requests.

![image](https://user-images.githubusercontent.com/66651087/219981433-45d8f05c-4918-418e-97d0-3f31c72de0eb.png)

