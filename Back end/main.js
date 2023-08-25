//import packages
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');//for media uploads
const setUploadLocation = 'newSrc/uploads';//set the desired file location, this should already be set by default but you can change the path
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, setUploadLocation));
    },
    filename: (req, file, cb)=> {
        cb(null, file.originalname);//save the name?
    }
});
//

//mongodb uri to access DB and collection  to use:
const dbToAccess = 'canvas';
const uri = `mongodb://localhost:27017/${dbToAccess}`;
const collection = 'elemlocs';//mongoose queries by the plural of this so the data is actually in elemLOcs
//

const http = require('http').Server(app);// bind app with http request 
const io = require('socket.io')(http);//attatch http server to the socket.io
const upload = multer({storage: storage}); //upload middleware


app.use(express.urlencoded({ extended: false }));//remove


app.use(express.static(path.join(__dirname, 'newSrc')));//we need so statically serve our images
//specify port and host
const port = process.env.PORT || 3000;
const host = '127.0.0.1';
const schema = mongoose.Schema;


//setting up the schema for our DB
const images = new schema({
    _id: mongoose.Types.ObjectId,
    img: String,
    x: String,
    y: String,
    height: String,
    width: String
})
//the schema will establish how the document will be in
//for the schema we want to be able to save 
//now we set up our model...
const imageCollect = mongoose.model(collection, images)// params passed are the collection name and the newly created schema name

//connect our datatbase
mongoose.connect(uri).then(() => console.log(`connection to ${dbToAccess} database successful`)).catch(() => {console.log(`could not connect to ${dbToAccess} database`)});;//establishing the connection uses buffering so the schema/model are created even if we didn't connect to DB
//delay for 5 seconds
async function getPositions(){
    const got = await imageCollect.find({});//find all items stored in the DB
    return got;
}
let storeData;
getPositions().then(initFetch => storeData = initFetch).catch((err) => {console.error(err)})

//will return an array of the documents from the db
//JSON.stringify() the fetched data to ouput the log to the console on the client side
//create a new connection
app.get('/', (req, res, next) =>{//setting our route and serving the page
    //console.log(req.cookies);//don;t need just messing with it
    res.sendFile(path.join(__dirname, '/newSrc/client/index.html'));
});

app.post('/', upload.single('img-uploaded'), (req, res, next) =>{//handles form submission specifically for allocating user upload of the image
    res.status(204).send();//successful post but stay on said page. This way the current client recieves the hooray of having uploaded!
});

//handling the socket events...
io.on('connection', (socket) =>{//instantiate and establish the socket so that we can connect to the client
    console.log(`user connected with session id: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`user ${socket.id} disconnected\n`);
        //this case happens when the user will reload or closes the tab
        //in this case we need to fetch the latest data from the DB
        getPositions().then(reFetch => storeData = reFetch).catch((err) => {console.error(err)})//refetch to serve newest addition
    });
    
    socket.emit("canvasLocs", storeData);//serve when client connects and reconnect
    
    socket.on('coord', (userAdding) => {//user is adding an image
        //the call will return {x:..., y:..., height:..., width:...}
        const newImage = new imageCollect({//instantiate the model
            _id: new mongoose.Types.ObjectId,
            img: path.basename(userAdding.img),//get the filename
            x: userAdding.x,
            y: userAdding.y,
            height: userAdding.height,
            width: userAdding.width
        });
        newImage.save().then((doc) => (console.log(`\nDatabase updated! ID: ${doc._id.toString()}\n`))).catch(()=> console.log('\nCould not update the database!\n'));
        io.emit('update', `client: ${socket.id} posted in location (X:${userAdding.x}, Y:${userAdding.y})`, userAdding.img);//can update live all I am doing is simply sending an image
        //notify all clients
        //with the current implementation on the front end the struggle is mostly found in the fact that 
    });
})

http.listen(port, () => {
    console.log(`Server is live at http://${host}:${port}/...\n`);
})