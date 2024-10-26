'use client'

import Image from "next/image";
import styles from "./page.module.css";
import http from "http";
import React, {useState} from "react";
import { error } from "console";
import { json } from "stream/consumers";

export default function home(props: any): any {
  const [targetWallet,        setTargetWallet]        = useState<string>('');  // type not strictly needed, but consistency
  const [targetWalletHistory, setTargetWalletHistory] = useState<string[]>([]);
  const [errorHistory,        setErrorHistory]        = useState<string[]>([]);
  const doTransfer = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    // if (!validAddress(targetWallet))
    //   return;
    const requestObject: GiveTokenRequest = {
      targetWallet: targetWallet,
      amount: {
        mantissa: 1,
        exponent: -4
      }
    };

    const response = await fetch("/api/giveToken", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestObject)});
    const data = await response.text();
    const responseObject: GiveTokenResponse = JSON.parse(data);

    if (responseObject.status == "failure") {
      setErrorHistory([...errorHistory, responseObject.reason ?? "unknown"]);
    }
    // must be success, then
    setTargetWalletHistory([...targetWalletHistory, responseObject.targetWallet]);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
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
          id="targetAddress"
          onChange={ event => setTargetWallet(event.target.value) }
          type="text"
          pattern="0x[a-fA-F0-9]{40}"
          title="Recipient address: "
          placeholder="0x1234...def"
          ></input>
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
            Get free ETH
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