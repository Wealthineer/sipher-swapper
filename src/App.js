import './App.css';
import { useState } from 'react';
import {ethers} from 'ethers';
import MTTMMA from'./artifacts/contracts/MttmMaToken.sol/MttmMaToken.json'

const mttmmaAddress = "0x4DFD6fd7093FFD589ea825B23a5E5f0A0eE21759"

function App() {

  //store greeting in local state
  const [userAccount, setUserAccount] = useState()
  const [amount, setAmount] = useState()

  //request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'})
  }

  async function getBalance(){
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, provider)
      const balance = await contract.balanceOf(account);

      console.log("Balance: ", balance.toString()/Math.pow(10, 18));
    }
  }

  async function sendCoins() {
    if (!userAccount) return
    if (!amount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.transfer(userAccount, ethers.utils.parseUnits(amount,18));
      await transaction.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }

  async function mint() {
    if (!userAccount) return
    if (!amount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.mint(userAccount, ethers.utils.parseUnits(amount,18));
      await transaction.wait();
    }
  }

  async function burn() {
    if (!amount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.burn(ethers.utils.parseUnits(amount,18));
      await transaction.wait();
    }
  }

  async function grantMinter() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.grantMinter(userAccount);
      await transaction.wait();
    }
  }

  async function revokeMinter() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.revokeMinter(userAccount);
      await transaction.wait();
    }
  }
  async function grantBurner() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.grantBurner(userAccount);
      await transaction.wait();
    }
  }

  async function revokeBurner() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.revokeBurner(userAccount);
      await transaction.wait();
    }
  }

  async function grantTransfer() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.grantTransfer(userAccount);
      await transaction.wait();
    }
  }

  async function revokeTransfer() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.revokeTransfer(userAccount);
      await transaction.wait();
    }
  }


  async function grantAdmin() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.grantAdmin(userAccount);
      await transaction.wait();
    }
  }

  async function revokeAdmin() {
    if (!userAccount) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(mttmmaAddress, MTTMMA.abi, signer);
      const transaction = await contract.revokeAdmin(userAccount);
      await transaction.wait();
    }
  }


  return (
      <div className="App">
        <header className="App-header">
          <button onClick={requestAccount}>Connect</button>
          <br />
          <button onClick={getBalance}>Get Balance</button>
          <button onClick={sendCoins}>Send Coins</button>
          <button onClick={mint}>Mint to Address</button>
          <button onClick={burn}>Burn your tokens</button>
          <button onClick={grantMinter}>Grant role minter</button>
          <button onClick={revokeMinter}>Revoke role minter</button>
          <button onClick={grantBurner}>Grant role burner</button>
          <button onClick={revokeBurner}>Revoke role burner</button>
          <button onClick={grantTransfer}>Grant role transfer</button>
          <button onClick={revokeTransfer}>Revoke role transfer</button>
          <button onClick={grantAdmin}>Grant role admin</button>
          <button onClick={revokeAdmin}>Revoke role admin</button>
          <input onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
          <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        </header>
      </div>
  );
}

export default App;
