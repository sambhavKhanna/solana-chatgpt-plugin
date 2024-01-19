import express from 'express';
import bodyParser from 'body-parser';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";


const port = 3000;
import cors from 'cors';

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

app.get('/getAllNFTs', async (req, res) => {
    try {
        const { public_key } = req.body;
        const publicKey = new PublicKey(public_key);
        const connection = new Connection('https://api.mainnet-beta.solana.com');

        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID });
        
        const tokenInfo = await connection.getAccountInfo(tokenAccounts.value[0].pubkey);

        const bufferData = tokenInfo.data;
        const encoding = 'utf8';

        const jsonString = Buffer.from(bufferData).toString(encoding);

        // Parse the JSON string to get the metadata object
        console.log('jsonString:', jsonString);

        const metadata = JSON.parse(jsonString);
        
        res.json( metadata );
    }
    catch(error) {
        console.log(error);
        res.json( { message: 'The user owns no NFTs' } );
    }
});

app.listen(port, () => {
    console.log(`App is listening at ${port}`);
})


