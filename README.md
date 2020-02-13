# rsp_data_visualizing
To run the app you need Docker and Docker Compose. Docker compose comes automatically with Docker Desktop.

You also need Node.js to install node modules.

First time setup:

1. `git clone https://github.com/moiman100/rsp_data_visualizing.git`
2. `cd rsp_data_visualizing`
3. `npm install`
4. `docker-compose up --build`

Nodemon will automatically restart the server when changes are made to ts files in src folder.

To stop the container use `ctrl + C`.

To add node modules:

1. stop the container
2. `npm install <module>`
3. Rebuild the container `docker-compose up --build -V`

To just start the container: `docker-compose up`.
