# What is Sun.js

Sun.js inherits from TronWeb and services for Sun-network. We  encapsulated two objects (mainchain and sidechain) based on TronWeb. The methods and attributes in mainchain or sidechain are exactly the same as the tronweb instance. For example, users can use sun.mainchain.trx.getBalance() to get balance from the mainchain. Futhermore, we add some new methods which are as follows in Sun class so that users can use them to contact between the main chain and the side chain. 

# Installation

<strong>Node.js</strong>

```javascript
npm install sun
```

or

```javascript
yarn add sun
```

<strong>Browser</strong>

Then easiest way to use Sun.js in a browser is to install it as above and copy the dist file to your working folder. For example:

```javascript
cp node_modules/sun/dist/Sun.js ./js/Sun.js
```

so that you can call it in your HTML page as

```javascript
<script src="./js/Sun.js"><script>
```
# Test cases

```javascript
npm run test
```
But before run test cases, you must add some info in test/config.js, such fullnode, solidity node, eventsever and private key.

# Documentation

[Sun](http://47.252.84.158:8080/sunnetwork/doc/guide/#sunweb-class)
