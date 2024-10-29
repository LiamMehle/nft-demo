'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { TransactionResponse } from "ethers";
import nftAbi from "../common/shyTokenAbi";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}



type CryptoState = {
  provider:    ethers.BrowserProvider,
  address:     string,
  shyContract: ethers.Contract
};

type FatSigner = {
  signer:  ethers.JsonRpcSigner,
  address: string
};

// higher order fuckery. Buttons reload the site, so gotta preventDefault it away every time.
function handler<T extends {preventDefault: ()=>void}>(f: (_:T)=>void): (_:T)=>void {
  return e => { e.preventDefault(); f(e); }
}

export default function home(props: any): any {
  const sourceWallet = useRef<string>('');  // type not strictly needed, but consistency
  const targetWallet = useRef<string>('');
  const tokenId      = useRef<number|undefined>(undefined);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const cryptoState  = useRef<CryptoState|undefined>(undefined);
  const processedTxs = useRef(new Set<string>());

  const connectMetamask = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.ethereum === undefined)
      return alert("Unable to access metamask plugin. Please make use you have it installed and enabled.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractAddress = "0x6b10BC40A6Bae5684E497bAe5611518DD657266F";
    // const shyContract = new ethers.Contract(contractAddress, nftAbi, provider);
    provider.getSigner(sourceWallet.current)
      .then(signer => {
        console.log(`sigher=${JSON.stringify(signer)}`)
        const shyContract = new ethers.Contract(contractAddress, nftAbi, signer);

        shyContract.on("event TokenMinted(uint id)", (id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;
          processedTxs.current.add(event.transactionHash);
          setEventHistory(eventHistory =>
            [...eventHistory, `Token minted with ID ${id}`]);
        });
        shyContract.on("event TokenGiven(address from, address to, uint id)", (from, to, id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;
          processedTxs.current.add(event.transactionHash);
          setEventHistory(eventHistory =>
            [...eventHistory, `Token ${id} given by ${from} to ${to}`])
        });
        shyContract.on("event TokenDestroyed(uint id)", (id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;
          processedTxs.current.add(event.transactionHash);
          setEventHistory(eventHistory =>
            [...eventHistory, `Token ${id} destroyed`])
        });

        cryptoState.current = {
          provider: provider,
          address: contractAddress,
          shyContract: shyContract
        };
      }).catch(e => console.error(e));
  }

  const doTransfer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState.current;
    
    // todo: call contract with signer(?) and correct parameters to give nft
    shyContract.give(tokenId.current, targetWallet.current).then((res: TransactionResponse) => {
      setEventHistory([...eventHistory, `sent token give request. hash: ${res.hash}`]);
    });
  };
  const mintToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined) return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState.current;
    shyContract.mint().then((res: TransactionResponse) => {
      setEventHistory([...eventHistory, `sent token mint request. hash: ${res.hash}`]);
    });
  }
  const checkOwnership = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined || tokenId.current === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState.current;
    shyContract.getOwner(tokenId.current).then(owner =>
      alert(`Token with ID ${tokenId.current} is owned by ${owner}`));
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TextContent />
        <div className={styles.horizontal}>
          <div className={styles.gapless}>
            token ID:
            <AddressInput id="token ID)" onChange={ (event) => tokenId.current = parseInt(event.target.value) } />
            from:
            <AddressInput id="from (address)" onChange={ (event) => sourceWallet.current = (event.target.value) } />
            to:
            <AddressInput id="to (address)" onChange={ event => targetWallet.current = (event.target.value) } />
            <div className={styles.ctas}>
              <button
                className={styles.primary}
                onClick={ handler(doTransfer) }>
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
                onClick={ handler(checkOwnership)}>
                check who owns the token
              </button>
              <button
                className={styles.secondary}
                onClick={ handler(mintToken)}>
                create new token
              </button>
            </div>
          </div>
          <div
          className={styles.ctas}>
            {/* <select style={{height:"1.5em"}} onChange={(s)=>setSignerIndex(parseInt(s.target.value))}>
              {(availableSigners ?? []).map( (x, index) => <option value={index}>{x.address}</option>)}
            </select> */}
            <button
            className={styles.primary}
            onClick={ handler(connectMetamask)}>
            connect to metamask
          </button></div>
        </div>
        <div>
          events:
          <ul>
            {eventHistory.map((event, index) => <li key={index}> {event} </li> )}
          </ul>
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
function AddressInput(props: {id: string, onChange: (_:React.ChangeEvent<HTMLInputElement>)=>void}) {
  const {id, onChange} = props;
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
