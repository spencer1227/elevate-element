const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

const db = require('./db/db.json');

const { v4: uuidv4 } = require('uuid');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', (err, data) => {
        if (err) throw err;
        let dbData = JSON.parse(data);
        res.json(dbData)
    });   
})

app.post('/api/notes', (req, res) => {
    const newNote = req.body

    newNote.id = uuidv4()

    db.push(newNote)

    fs.writeFileSync('./db/db.json', JSON.stringify(db))
    , (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        res.send(200);
      }})

app.delete('/api/notes/:id', (req, res) => {
    const newDb = db.filter((note) =>
        note.id !== req.params.id)

    fs.writeFileSync('./db/db.json', JSON.stringify(newDb))

    res.json(newDb)
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () =>
    console.log(`App listening on ${PORT}`))