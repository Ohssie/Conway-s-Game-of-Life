# Conway's Game of Life

This is a simple implementation of Conway's Game of life using ReactJs. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## How to Setup the application

Using your terminal/command prompt, navigate to the `client` directory in the main project directory, then you should run `yarn install` and after that is completed, run `yarn start`. These commands would install the dependencies needed to run this application smoothly and also start the development server.

## Testing the application

After the development server has been started, a URL is provided in your terminal in this format [http://localhost:3000](http://localhost:3000). Click on this URL or open it upon your browser to view this application.

Next, you are provided with a form on your browsers interface that asks for an input to define the `height` and `width` of the desired grid you want to generate. After filling this form and hitting on the `Go!` button, a grid is generated with random figures(indicating `live`(white grid cells) and `dead`(black grid cells) cells) and displayed on your browser page for you. After this, click on `Run` to watch the regeneration happen.

You can also change the speed/interval at which the regeneration is done and also pause(`stop`) and continue the regeneration.

Please also keep in mind that the state of this grid at every point is being stored in a persistent storage and if for any reason, your browser page reloads or there was an interruption, the initial state is stored in the `localStorage` and you can easily resume the regeneration iteration from where it was interrupted.


<!-- **Note: ** -->