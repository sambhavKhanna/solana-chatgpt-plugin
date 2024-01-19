import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

export const requestAirdrop = async (req, res) => {
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