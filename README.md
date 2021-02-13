# BCDV1011-lab6
## Design Patterns Lab 6
### React fetch to Express server-signed tx to Solidity

1. Spin up Ganache or ganache-cli -d (deterministric beacuse of hardcoded EOA, private key and first contract deploy), and change "/express/index.js:3" from 8545 to 7545 if needed
2. Compile SimpleStorage.sol with solc v0.7.1 and deploy
3. cd into "/express" and "npm i", then perform "node index"
4. cd into "/react" and "npm i", then perform "npm start"
5. If not auto-launched, navigate to http://localhost:3000
6. To invoke "SimpleStorage.get() returns(uint256)" click the "Get Stored Data" button
7. To invoke "SimpleStorage.set(uint256)" enter a value and click the "Set" button
