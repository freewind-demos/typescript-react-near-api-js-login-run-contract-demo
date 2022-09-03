TypeScript React "near-api-js" Login Run Contract Demo
=================================

直接使用`near-api-js`而非`wallet-selector`进行登录并执行 function call（包括change function)

多次connectToNear以及创建WalletConnection对象，信息都是从`localStorage`中取的，可以当作同一个对象使用，不会产生格外连接。

每次SignIn只能指定一个contract。如果登录到新的contract，之前的登录就无效了。如果操作其change method，每次都需要 approve

```
npm install
```

## Deploy contract

已经操作过，不需要再操作

```
near login
npm run deploy-contract
npm run deploy-contract
```

## Run frontend

```
npm start
```


