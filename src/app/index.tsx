'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useRef } from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { TransactionResponse } from "ethers";
import nftAbi from "../common/shyTokenAbi";
import { GetServerSideProps } from "next";
// import { getServerSideProps } from "next/dist/build/templates/pages";

declare global {
  interface Window {
    ethereum?:MetaMaskInpageProvider
  }
}

type CryptoState = {
  provider:    ethers.BrowserProvider,
  address:     string,
  shyContract: ethers.Contract
};

// higher order fuckery. Buttons reload the site, so gotta preventDefault it away every time.
function handler<T extends {preventDefault: ()=>void}>(f: (_:T)=>void): (_:T)=>void {
  return e => { e.preventDefault(); f(e); }
}

const contractAddress = "0xAc15511438855bD3889117cBE8CF9a1de7005718";

export default function home(props: any): any {
  const sourceWallet = useRef<string>("");  // type not strictly needed, but consistency
  const targetWallet = useRef<string>("");
  const tokenId      = useRef<number|undefined>(undefined);
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [message,      setMessage     ] = useState<string>("");
  const cryptoState  = useRef<CryptoState|undefined>(undefined);
  const processedTxs = useRef(new Set<string>());

  const connectMetamask = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.ethereum === undefined)
      return alert("Unable to access metamask plugin. Please make use you have it installed and enabled.");

    const provider = new ethers.BrowserProvider(window.ethereum);

    provider.getSigner(sourceWallet.current)
      .then(signer => {
        console.log(`signer=${JSON.stringify(signer)}`)
        const shyContract = new ethers.Contract(contractAddress, nftAbi, signer);

        shyContract.on("event TokenMinted(uint id)", (id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;  // already processed
          processedTxs.current.add(event.transactionHash);

          setEventHistory(eventHistory => [...eventHistory, `Token minted with ID ${id}`]);
        });

        shyContract.on("event TokenGiven(address from, address to, uint id)", (from, to, id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;
          processedTxs.current.add(event.transactionHash);

          setEventHistory(eventHistory => [...eventHistory, `Token ${id} given by ${from} to ${to}`])
        });

        shyContract.on("event TokenDestroyed(uint id)", (id, event: ethers.EventLog) => {
          if (processedTxs.current.has(event.transactionHash))
            return;
          processedTxs.current.add(event.transactionHash);

          setEventHistory(eventHistory => [...eventHistory, `Token ${id} destroyed`])
        });

        cryptoState.current = {
          provider: provider,
          address: contractAddress,
          shyContract: shyContract
        };
      }).catch(e => setMessage(`failed to connect to MetaMask: ${JSON.stringify(e)}`));
  };


  const doTransfer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState.current;
    
    // todo: call contract with signer(?) and correct parameters to give nft
    shyContract.give(tokenId.current, targetWallet.current)
      .then((res: TransactionResponse) =>
        setEventHistory([...eventHistory, `sent token give request. hash: ${res.hash}`]))
      .catch(e => setMessage(`Failed to give token to ${targetWallet.current}.`));
  };


  const mintToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined) return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState.current;
    shyContract.mint()
      .then((res: TransactionResponse) =>
        setEventHistory([...eventHistory, `sent token mint request. hash: ${res.hash}`]))
      .catch(e =>
        setMessage('failed to mint token.'));
  };

      
  const checkOwnership = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState.current === undefined || tokenId.current === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState.current;
    shyContract.getOwner(tokenId.current)
      .then(owner => {
        const message = `Token with ID ${tokenId.current} is owned by ${owner}`;
        alert(message);
        setEventHistory([...eventHistory, message]);
      }).catch(e =>
        setMessage('failed to get the owner of the token.')
      );
  };



  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TextContent />
        <div className={styles.horizontal}>
          <div className={styles.gapless}>
            your wallet address:
            <AddressInput id="from (address)" onChange={ event => sourceWallet.current = (event.target.value) } />
            token ID:
            <NumberInput id="token ID)" onChange={ event => tokenId.current = parseInt(event.target.value) } />
            to:
            <AddressInput id="to (address)" onChange={ event => targetWallet.current = (event.target.value) } />
            <div className={styles.ctas}>
              <button
                className={styles.primary}
                onClick={ handler(connectMetamask)}>
                  <Image
                  className={styles.logo}
                  src="/vercel.svg"
                  alt="Vercel logomark"
                  width={20}
                  height={20} />
                connect to metamask
              </button>
              <button
                className={styles.secondary}
                onClick={ handler(mintToken)}>
                Create new token
              </button>
              <button
                className={styles.primary}
                onClick={ handler(doTransfer) }>
                Give token
              </button>
              <button
                className={styles.secondary}
                onClick={ handler(checkOwnership)}>
                Find token owner
              </button>
              <p className={styles.error}>{message.length > 0 && message}</p>
            </div>
          </div>
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

function NumberInput(props: {id: string, onChange: (_:React.ChangeEvent<HTMLInputElement>)=>void}) {
  const {id, onChange} = props;
  return (
    <input
      id={id}
      onChange={onChange}
      type="number"
      pattern="[0-9]+"
      title="Recipient address: "
      placeholder="...357..."
      className={styles.address}
      />
    );
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
