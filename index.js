const express = require('express');
const bodyParser = require('body-parser');
const { balance } = require('./handlers/balance');
const { requestAirdrop } = require('./handlers/requestAirdrop');
const { getAllNFTs } = require('./handlers/getAllNFTs');
const cors = require('cors')
const port = 3000;
const app = express();


app.use(cors());
app.use(bodyParser.json());

app.get('/.well-known/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(__dirname + '/.well-known/' + filename);
});

app.get('/balance', balance);
app.post('/requestAirdrop', requestAirdrop);
app.get('/getAllNFTs', getAllNFTs);

app.listen(port, () => {
    console.log(`App is listening at ${port}`);
})


