const express = require('express');
const bodyParser = require('body-parser');
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const port = 3000;
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/.well-known/:filename', (req, res) => {
    const filename = req.params.filename;
    res.sendFile(__dirname + '/.well-known/' + filename);
});

app.get('/balance', async (req, res) => {
    const { public_key, rpcConnection } = req.body;
    if (!public_key) { 
        res.status(404).json( { message: 'Public key not provided' } ); 
    }
    else {
        const rpcEndpoint = 'https://api.' +  rpcConnection + '.solana.com';
        const connection = new Connection(rpcEndpoint);
        const publicKey = new PublicKey(public_key);

        const accountInfo = await connection.getAccountInfo(publicKey);
        if (accountInfo === null) { 
            res.status(404).json( { message: 'Invalid Public key' } ); 
        }

        else {
            const solBalance = accountInfo.lamports/LAMPORTS_PER_SOL;
            res.status(200).json( { message: 'The balance is ' + solBalance + ' SOL' } );
        }
    }
});

app.post('/requestAirdrop', async (req, res) => {
    const { public_key, amount } = req.body;
    const connection = new Connection('https://api.devnet.solana.com');
    const publicKey = new PublicKey(public_key);

    try {
        const signature = await connection.requestAirdrop(publicKey, amount * LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature);
        res.status(200).json( { message: 'Successful' } );
    }
    catch(error) {
        res.status(429).json( { message: 'Failed' } );
    }
});



app.listen(port, () => {
    console.log(`App is listening at ${port}`);
})


