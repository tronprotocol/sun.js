# What is Sun.js

Sun.js is a kind of js-sdk and services for Tron Network and Sun Network. We encapsulated two objects (mainchain and sidechain). The methods and attributes in mainchain or sidechain can be used to connect with TRON. For example, users can use sun.mainchain.trx.getBalance() to get balance from the mainchain. Futhermore, we add some methods which are as follows in Sun class so that users can use them to contact between the main chain and the side chain.

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
But before run test cases, you must add some info in test/config.js, such as fullNode, solidityNode, eventServer and private key.

