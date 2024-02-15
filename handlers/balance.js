const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const balance = async (req, res) => {
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
}

module.exports = { balance }