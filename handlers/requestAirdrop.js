const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const requestAirdrop = async (req, res) => {
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
}

module.exports = { requestAirdrop }