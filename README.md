# Kickstart Clone with BlockChain and Ethereum
## Dependencies
- `fs-extra`: file system related package (community version).
- `ganache-cli`: Local testing network package.
- `mocha`: Javascript testing module.
- `next`: Next.js for server-side rendering.
- `next-routes`: Routing add-ons for Next.js.
- `react`: React.js.
- `react-dom`: DOM support package of React.js.
- `semantic-ui-css`: CSS styling package of SemanticUI.
- `semantic-ui-react`: SemanticUI that supports React.js.
- `solc`: Solidity compiler.
- `truffle-hdwallet-provider`: Provide an endpoint for us to one of the rinkeby network nodes by infura.
- `web3`: Web3.js.

## Project Overall Structure
```
kickstart/
    |
    -> components/ (reuseable react components)
    |
    -> ethereum/ (all the ethereum-ralated stuffs)
    |   |
    |   -> contracts/ (solidity smart contract .sol files)
    |   |
    |   -> build/ (built solidity smart contract .json files.)
    |
    -> pages/ (multi-page frontend pages required by next.js)
    |
    -> test/ (testing scripts)
    |
    -> routes.js (setting up next.js routes)
    |
    -> server.js (setting up next.js server)
```

## Questions
#### Q: Why Next.js, anyways?
- With server-side rendering, we can serve some contents on the webpage much faster, especially when the users' mobile/internet connection is bad. (since next.js tries to render the javascript code on the next server, instead of directly sending all the javascript code to the browser and let the browser download it then render the code by itself.)
- We can do some initial data fetching to build our webpage and don't need to make use of the MetaMask extension on our browser (since most people do not install MetaMask on their browser, we have to ensure those users can still see contents on their screens. They won't even notice there is any problem as long as they don't submit any transaction to our solidity contract.).

## Project Details
- Write the smart contract using solidity in the remix editor, then paste it to `ethereum/contracts/xxx.sol`.
    - All the authentication logics should be programmed into our smart contract (ex: Who can manage the contract; who can create a new campaign, etc.) using a custom **restriced() modifier**.
    - The mapping object in solidity can only answer the response of a given key (return a default value if the key is not in the mapping). Since the mapping object cannot be iterated through, we cannot get all the keys nor all the values back from the mapping object. -> use an extra variable to keep track of the number of keys/values if wanted.
    - We can use a **Factory Contract** to deploy smart contracts automatically! -> `address deployedContractAddress = new ContractClass(...);`.
- Compile the solidity smart contract and save the compiled .json file to `ethereum/build/` using `ethereum/compile.js`.
    - Use **solc** solidity compiler to compile the solidity code.
    - Iterate through the compiled contracts and save each contract object to a .json file.
        1. Detele build/
        2. Read Campaign.sol solidity contract.
        3. Compile the contract using solidity conpiler (solc).
        4. Write the compiled build to build/.
    - Each time we change the content in the smart contract, we have to re-run this compile.js file.
- Write our test using **mocha**.
    - write the testing script in `test/Campaign.test.js`.
- Deploy the built smart contract.
    - Read the built smart contract from `ethereum/bulid/`.
    - Get the provider that connects to one endpoint of the Rinkeby testing network using **truffle-hdwallet-provider** and **infura** and our own **Mnemonic**, then inject the provider into a web3 instance.
    - Deploy the contract to the Rinkeby testing network, and console.log the deployed contract's address to the console.
    - Copy the deployed contract's address and save it somewhere for later usage.
    - Each time we change the content in the smart contract, we have to re-run this deploy.js file after we run the compile.js file first.
- Setup our web3 instance for the whole multi-page web application.
    - Use different web3 instance on the next server and on the webpage.
    - Create the web3 instance based on the environment we are currently on.
        1. Next server: does not have access to the `window` variable.
        2. Browser: have access to the `window` variable.
            - MetaMask installed: have access to the `window.ethereum` variable.
            - MetaMask NOT installed: does not ahve access to the `window.ethereum` variable.
    - Code snippets:
        ```js
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
        ```
- Create the javascript deployed CampaignFactory instance using `web3.eth.Contract(abi, address)`.
    - Use `JSON.parse()` to parse the compiled contract object interface.
    - Address is the returned deployed address that we copied from the console.log before.
- Create the javascript Campaign instance **generator** function also using `web3.eth.Contract(abi, address)`. Instead, this time the address is a variable given from outside.

