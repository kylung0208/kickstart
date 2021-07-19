/*
    Create the web3 instance based on the environment we are currently on.
        1. Next server: does not have access to the `window` variable.
        2. Browser: have access to the `window` variable.
            - MetaMask installed: have access to the `window.ethereum` variable.
            - MetaMask NOT installed: does not ahve access to the `window.ethereum` variable.
*/
import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    // We are in the browser and metamask is running.
    window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
    console.log('***We are in the browser and metamask is running***')
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        "https://rinkeby.infura.io/v3/cf02e5fbd0ee43fc810e53cc3be6391a"
    );
    web3 = new Web3(provider);
    console.log('***We are on the server *OR* the user is not running metamask***')
}

export default web3;