const Web3 = require("web3");
var config = require("./config");
var web3 = new Web3(new Web3.providers.HttpProvider(config.gethUrl));

function unlock(account, callBack) {
    web3.eth.personal.unlockAccount(account, "", config.accountUnlockTime).then(
        () => {
            "use strict";
            if (callBack) {
                callBack()
            }
        });
}

function sendTransaction(fromAccount, toAccount, valueString) {
    web3.eth.sendTransaction({
        from: fromAccount,
        to: toAccount,
        value: valueString
    }, '').on('transactionHash', function (hash) {
        console.log("hash-----")
    }).on('receipt', function (receipt) {
        console.log("receipt-----")
    }).on('confirmation', function (confirmationNumber, receipt) {
        console.log("confirmationNumner:" + confirmationNumber)
    }).on('error', console.error); // If a out of gas error, the second parameter is the receipt.
}

function generateTransactionParams() {
    var number = Math.floor(Math.random() * (config.TestEthMaxPerTx));
    return {
        fromAccount: config.defaultAccount, toAccount: config.testAccount, valueString: number.toString()
    }
}

function getAccountTxCounts(account) {
    return web3.eth.getTransactionCount(account);
}

function main() {
    const Koa = require('koa');
    const app = new Koa();

    const main = async function (ctx, next) {
        if (ctx.request.path == config.addTxUrl) {
            var prarams = generateTransactionParams()
            sendTransaction(prarams.fromAccount, prarams.toAccount, prarams.valueString)
            ctx.response.body = 'ok';
        } else if (ctx.request.path == config.unlockUrl) {
            unlock(config.defaultAccount, () => {
                "use strict";
                console.log("unlock " + config.defaultAccount)
            })
            ctx.response.body = 'ok';
        } else if (ctx.request.path == config.getTxCountUrl) {
            data = await getAccountTxCounts(config.defaultAccount)
            ctx.response.body = data
        }
    };

    app.use(main);
    app.listen(3001);
}

main()
