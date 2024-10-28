'use client'

import Image from "next/image";
import styles from "./page.module.css";
import React, {useState, useMemo, unstable_SuspenseList} from "react";
import { ethers } from "ethers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { TransactionResponse } from "ethers";

declare global {
  interface Window{
    ethereum?:MetaMaskInpageProvider
  }
}

const nftAbi = [
  {
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token",
				"type": "uint256"
			}
		],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroyContract",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "ContractDestroyed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "give",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "TokenDestroyed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "TokenGiven",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "TokenMinted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token",
				"type": "uint256"
			}
		],
		"name": "getOwner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "isActive",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "minter",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokenOwners",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
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

// higher order fuckery. Buttons reload the site, so gotta preventDefault it away every time.
function handler<T extends {preventDefault: ()=>void}>(f: (_:T)=>void): (_:T)=>void {
  return e => { e.preventDefault(); f(e); }
}

export default function home(props: any): any {
  const [sourceWallet, setSourceWallet] = useState<string>('');  // type not strictly needed, but consistency
  const [targetWallet, setTargetWallet] = useState<string>('');
  const [eventHistory, setEventHistory] = useState<string[]>([]);
  const [cryptoState,  setCryptoState ] = useState<CryptoState|undefined>(undefined);

  const connectMetamask = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (window.ethereum === undefined)
      return alert("Unable to access metamask plugin. Please make use you have it installed and enabled.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contractAddress = "0x6b10BC40A6Bae5684E497bAe5611518DD657266F";
    // const shyContract = new ethers.Contract(contractAddress, nftAbi, provider);
    provider.getSigner(sourceWallet)
      .then(signer => {
        console.log(`sigher=${JSON.stringify(signer)}`)
        const shyContract = new ethers.Contract(contractAddress, nftAbi, signer);

        shyContract.on("event TokenMinted(uint id)", (args) => {
          setEventHistory([...eventHistory, `Token minted with ID ${JSON.stringify(args)}`]);
        });
        shyContract.on("TokenGiven", (args) => {
          setEventHistory([...eventHistory, JSON.stringify(args)]);//`Token with ID ${id} given by ${from} to ${to}`]);
        });
        shyContract.on("event TokenDestroyed(uint id)", (args) => {
          setEventHistory([...eventHistory, JSON.stringify(args)]);//`Token with ID ${id} destroyed`]);
        });

        setCryptoState({
          provider: provider,
          address: contractAddress,
          shyContract: shyContract
        });
      }).catch(e => console.error(e));
  }

  const doTransfer = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState
    
    // todo: call contract with signer(?) and correct parameters to give nft
    shyContract.minter().then(x => alert(JSON.stringify(x)));
  };
  const mintToken = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState === undefined) return;  // todo: figure out error handling
    
    const {provider, address, shyContract} = cryptoState
    shyContract.mint().then((res: TransactionResponse) => {
      setEventHistory([...eventHistory, `sent token request. hash: ${res.hash}`]);
    });
  }
  const checkOwnership = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cryptoState === undefined) return;  // todo: figure out error handling
    
    const {shyContract} = cryptoState
    const tokenId = sourceWallet ?? targetWallet;
    shyContract.getOwner(tokenId).then(owner =>
      alert(`Token with ID ${tokenId} is owned by ${owner}`));
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <TextContent />
        <div className={styles.horizontal}>
          <div className={styles.gapless}>
            from:
            <AddressInput id="from (address)" onChange={ (event) => setSourceWallet(event.target.value) } />
            to:
            <AddressInput id="to (address)" onChange={ event => setTargetWallet(event.target.value) } />
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
