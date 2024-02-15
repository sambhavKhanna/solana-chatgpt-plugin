const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const connection = new Connection('https://api.mainnet-beta.solana.com');
// const metaplex = new Metaplex(connection);

const getAllNFTs = async (req, res) => {
   try {
    const { public_key } = req.body;
    const publicKey = new PublicKey(public_key);
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey);
    // const metadata = await metaplex.nfts().findAllByOwner( { owner: metaplex.identity().publicKey } );
    res.json( tokenAccounts );
   }
   catch(error) {
    res.json( { message: 'The user owns no NFTs' } );
   }
}

module.exports = { getAllNFTs }