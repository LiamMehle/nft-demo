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

export default function home(props: any): any {
  const [sourceWallet,        setSourceWallet]        = useState<string>('');  // type not strictly needed, but consistency
  const [targetWallet,        setTargetWallet]        = useState<string>('');
  const [targetWalletHistory, setTargetWalletHistory] = useState<string[]>([]);
  const [errorHistory,        setErrorHistory]        = useState<string[]>([]);
  const [provider, shyContract] = useMemo(() => {
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
      "address public minter"
    ];
    
    if (window.ethereum === undefined)
      return [];
    const provider = new ethers.BrowserProvider(window.ethereum);
    const address = "0xa4ea8f621006bf4ff6f87e4bf591026267fad2f5";
    const shyContract = new ethers.Contract(address, nftAbi, provider);
    return [provider, shyContract];
  }, [window.ethereum]);

  const doTransfer = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (provider === undefined || shyContract === undefined)
      return;  // todo: figure out error handling
    // todo: call contract with signer(?) and correct parameters to give nft
    alert(await shyContract.symbol());
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <span style={{display: "inline-block", flexDirection: "row", alignItems:"flex-end"}}>
          <Image
            className={styles.logo}
            src="/next.svg"
              alt="Next.js logo"
            width={180}
            height={38}
            priority
            style={{verticalAlign:"baseline"}}
          /><span style={{marginLeft:"1em", position:"relative",}}>app I created.</span>
        </span>
        <ol>
          <li>
            <i>Already got started</i> by editing <code>src/app/page.tsx</code>.
          </li>
          <li>
            Then, created a new file called <code>index.tsx</code> next to it <i>(per the instructions)</i> and pointed <code>page.tsx</code> to it.
          </li>
          <li>Saved and saw the changes <i>near</i> instantly.</li>
        </ol>
        <input
          id="from (address)"
          onChange={ event => setSourceWallet(event.target.value) }
          type="text"
          pattern="0x[a-fA-F0-9]{40}"
          title="Recipient address: "
          placeholder="0x1234...def"
          />
        <input
          id="to (address)"
          onChange={ event => setTargetWallet(event.target.value) }
          type="text"
          pattern="0x[a-fA-F0-9]{40}"
          title="Recipient address: "
          placeholder="0x1234...def"
          />
        <div className={styles.ctas}>
          <button
            className={styles.primary}
            onClick={ doTransfer }
            // href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            // target="_blank"
            // rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Get free token
          </button>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
        <div>
          <div>transfers:</div>
          <ol>
            {targetWalletHistory.map(wallet => <li key={wallet}> {wallet} </li> )}
          </ol>
          <div>errors:</div>
          <ol>
            {errorHistory.map(error => <li key={error}> {error} </li> )}
          </ol>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}