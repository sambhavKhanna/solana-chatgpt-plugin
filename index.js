import express from 'express';
import bodyParser from 'body-parser';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { balance } from './handlers/balance';
import { requestAirdrop } from './handlers/requestAirdrop';
import { getAllNFTs } from './handlers/getAllNFTs';

const port = 3000;
import cors from 'cors';

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


