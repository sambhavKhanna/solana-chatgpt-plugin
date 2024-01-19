import express from 'express';
import bodyParser from 'body-parser';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
// import { Metaplex } from "@metaplex-foundation/js";

const connection = new Connection('https://api.mainnet-beta.solana.com');
// const metaplex = new Metaplex(connection);

export const getAllNFTs = async (req, res) => {
   try {
    const { public_key } = req.body;
    const publicKey = new PublicKey(public_key);
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey);
    // const metadata = await metaplex.nfts().findAllByOwner( { owner: metaplex.identity().publicKey } );
    console.log('Hi');
    console.log(tokenAccounts);
    res.json( tokenAccounts );
   }
   catch(error) {
    res.json( { message: 'The user owns no NFTs' } );
   }
}

