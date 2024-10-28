'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, {useState, useMemo} from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

const nftAbi = [
  // Some details about the token
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function getOwner(uint token) public view returns (address)",
  "function mint() public returns (uint)",
  "function destroy(uint token) public",
  "function give(uint token, address to) public",
  // Function to destroy the contract and send funds to the specified address
  "function destroyContract() public",
  "function minter() view returns (address)"
];

type CryptoState = {
  provider:    ethers.BrowserProvider,
  address:     string,
  shyContract: ethers.Contract
};

type FatSigner = {
  signer:  ethers.JsonRpcSigner,
  address: string
};

export default function home(props: any): any {
  const [sourceWallet,        setSourceWallet]        = useState<string>('');  // type not strictly needed, but consistency
  const [targetWallet,        setTargetWallet]        = useState<string>('');
  const [targetWalletHistory, setTargetWalletHistory] = useState<string[]>([]);
  const [errorHistory,        setErrorHistory]        = useState<string[]>([]);
  const [cryptoState,         setCryptoState]         = useState<CryptoState|undefined>(undefined);
  const [signerIndex,         setSignerIndex]         = useState(0);
  // state is to remember when they are listed
  const [availableSigners,    setAvailableSigners]    = useState<FatSigner[] | undefined>(undefined);
  // memo to only recompute when window.etherium changes. It's either undefined (-> undefined) or a valid value (-> signers[])
  useMemo(() => {
    if (window.ethereum === undefined)              // metamask hasn't loaded yet
      return console.error('etherum not defined');  // nothing to do
    console.info('dispatched ethers load')

    const provider = new ethers.BrowserProvider(window.ethereum);                     // provider (view into 'web3')
    provider.listAccounts()                                                           // get accounts, but it's a promise.
      .then(signers =>                                                                // when Signer[] promise resolves, convert to Address[].
        Promise.all(signers.map( s=>                                                  // ..it's another promise.
          s.getAddress().then(a=>{ return {address: a, signer: s}} ))))               // (store signer along with address to avoid resolvng the promise again later)
      .then(signers => { console.log(`acquired signers: ${JSON.stringify( )}`)  // when SignerAddress[] promise resolves,
        setAvailableSigners(signers)});                                               // store their addresses
  }, [window.ethereum]);

  const connectMetamask = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (window.ethereum === undefined)
      return alert("Unable to access metamask plugin. Please make use you have it installed and enabled.");
    if (availableSigners === undefined)
      return alert("Signer not found in metamask plugin, what did you do?");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const address = "0xa4ea8f621006bf4ff6f87e4bf591026267fad2f5";
    const shyContract = new ethers.Contract(address, nftAbi, provider);
    
    shyContract.connect(availableSigners[signerIndex].signer);

    setCryptoState({
      provider: provider,
      address: address,
      shyContract: shyContract
    });
  }

  const doTransfer = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (cryptoState === undefined)
      return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState
    
    // todo: call contract with signer(?) and correct parameters to give nft
    alert(await shyContract.minter());
  };
  const mintToken = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (cryptoState === undefined)
      return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState
    
    const tokenId: Number = await shyContract.mint();
    
    alert(`you are now the proud owner of token #${tokenId}`);
  }
  const checkOwnership = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (cryptoState === undefined)
      return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState
    const tokenId = sourceWallet ?? targetWallet;
    const owner = await shyContract.getOwner(tokenId);
    
    alert(`Token with ID ${tokenId} is owned by ${owner}`);
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TextContent />
        <div className={styles.horizontal}>
          <div className={styles.gapless}>
            from:
            <AddressInput id="from (address)" onChange={ event => setSourceWallet(event.target.value) } />
            to:
            <AddressInput id="to (address)" onChange={ event => setTargetWallet(event.target.value) } />
            <div className={styles.ctas}>
              <button
                className={styles.primary}
                onClick={ doTransfer }>
                <Image
                  className={styles.logo}
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20}
                />
                Give token
              </button>
              <button
                className={styles.secondary}
                onClick={checkOwnership}>
                check who owns the token
              </button>
              <button
                className={styles.secondary}
                onClick={mintToken}>
                create new token
              </button>
            </div>
          </div>
          <div
          className={styles.ctas}>
            <select style={{height:"1.5em"}} onChange={(s)=>setSignerIndex(parseInt(s.target.value))}>
              {(availableSigners ?? []).map( (x, index) => <option value={index}>{x.address}</option>)}
            </select>
            <button
            className={styles.primary}
            onClick={connectMetamask}>
            connect to metamask
          </button></div>
        </div>
        <div>
          transfers:
          <ol>
            {targetWalletHistory.map(wallet => <li key={wallet}> {wallet} </li> )}
          </ol>
          errors:
          <ol>
            {errorHistory.map(error => <li key={error}> {error} </li> )}
          </ol>
        </div>
      </main>
      <Footer />
    </div>
  );
}
function Footer({}) {
  return (<footer className={styles.footer}>
    <a href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
      <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
      Learn
    </a>
    <a href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
      <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
      Examples
    </a>
    <a href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
      <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
      Go to nextjs.org →
    </a>
  </footer>);
}

function TextContent({}) {
  return (<>
  <span style={{ display: "inline-block", flexDirection: "row", alignItems: "flex-end" }}>
    <Image
      className={styles.logo}
      src="/next.svg"
      alt="Next.js logo"
      width={180}
      height={38}
      priority style={{ verticalAlign: "baseline" }} />
      <span style={{ marginLeft: "1em", position: "relative" }}> app I created. </span>
    </span>
    <ol>
      <li>
        <i>Already got started</i> by editing <code>src/app/page.tsx</code>.
      </li>
      <li>
        Then, created a new file called <code>index.tsx</code> next to it <i>(per the instructions)</i> and pointed <code>page.tsx</code> to it.

        </li>
      <li>
        Saved and saw the changes <i>near</i> instantly.
      </li>
    </ol>
  </>);
}
function AddressInput({id, onChange}) {
  return (
    <input
      id={id}
      onChange={onChange}
      type="text"
      pattern="0x[a-fA-F0-9]{40}"
      title="Recipient address: "
      placeholder="0x1234...def"
      className={styles.address}
      />
    );
}
