const request = require('request');
const URL = 'http://18.219.20.226:7777';
const URL_FEE = 'https://18.219.20.226';
const EXPLORERS = {
    'btc': 'https://live.blockcypher.com/btc/tx/',
    'ltc': 'https://live.blockcypher.com/ltc/tx/',
    'dash': 'https://live.blockcypher.com/dash/tx/',
    'bch': 'https://explorer.bitcoin.com/bch/tx/',
    'eth': 'https://etherscan.io/tx/',
    'etc': 'https://gastracker.io/tx/',
    'doge': 'https://live.blockcypher.com/doge/tx/'
};

let prevAddress = '';

document.addEventListener('DOMContentLoaded', async () =>  {
    let fee = await getFee('btc');
    console.log(fee);
    document.getElementById('fee').value = fee;
    document.getElementById('balance').textContent = `Баланс - ${(document.getElementById('chain').value).toUpperCase()}`;

    document.getElementById('chain').addEventListener('change', async () => {
        document.getElementById('sourceAddress').value = '';
        document.getElementById('pk').value = '';
        document.getElementById('targetAddress').value = '';
        document.getElementById('amount').value = '';
        document.getElementById('sum-ticker').textContent = `${(document.getElementById('chain').value).toUpperCase()}`;
        document.getElementById('fee').value = '';
        document.getElementById('fee-ticker').textContent = `${(document.getElementById('chain').value).toUpperCase()}`;
        document.getElementById('hash').value = '';
        document.getElementById('submit').disabled = true;
        document.getElementById('balance').textContent = `Баланс - ${(document.getElementById('chain').value).toUpperCase()}`;
        prevAddress = '';
        let chain = document.getElementById('chain').value;
        let fee = await getFee(chain);
        document.getElementById('fee').value = fee;
    })

    document.getElementById('submit').addEventListener('click', async () => {
        document.getElementById('chain').disabled = true;
        let chain = document.getElementById('chain').value;
        let sourceAddress = document.getElementById('sourceAddress').value;
        let pk = document.getElementById('pk').value;
        let targetAddress = document.getElementById('targetAddress').value;
        let amount = document.getElementById('amount').value;
        let fee  = document.getElementById('fee').value;
        const params = {
            chain: chain,
            sourceAddress: sourceAddress,
            privateKey: pk,
            targetAddress: targetAddress,
            amount: amount,
            fee: fee
        }
        let hash = await sendTx(params);
        document.getElementById('hash').innerHTML = `<label>Hash транзакции</label> <label id='txid'>${hash}</label>`;
        document.getElementById('chain').disabled = false;
    })

    document.getElementById('hash').addEventListener('click', () => {
        const chain = document.getElementById('chain').value;
        const uri = EXPLORERS[chain] + document.getElementById('txid').textContent;
        console.log('URL explorer:', uri);
        window.open(uri);
    })
});

setInterval(async () => {
    let chain = document.getElementById('chain').value;
    let sourceAddress = document.getElementById('sourceAddress').value;
    let pk = document.getElementById('pk').value;
    let targetAddress = document.getElementById('targetAddress').value;
    let amount = document.getElementById('amount').value;
    let fee  = document.getElementById('fee').value;
    if (sourceAddress != prevAddress) {
        if (sourceAddress == '') {
            document.getElementById('balance').textContent = `Баланс - ${(document.getElementById('chain').value).toUpperCase()}`;    
        } else {
            prevAddress = sourceAddress;
            let balance = await getBalance(chain, sourceAddress);
            document.getElementById('balance').textContent = `Баланс ${balance} ${(document.getElementById('chain').value).toUpperCase()}`;
        }
    }
    // console.log("Chain:", chain, "sourceAddress:", sourceAddress, "targetAddress:", targetAddress, "amount:", amount, "fee:", fee);
    if (sourceAddress && pk && targetAddress && amount && fee && chain) {
        document.getElementById('submit').disabled = false;
    }
}, 100)

let getFee = (chain) => {
    return new Promise((resolve, reject) => {
        request({
          uri: URL_FEE + '/fee/findout',
          qs: {
            chain: chain
          },
          json: true
        },
          (error, response, body) => {
            if(error) console.log(error);;
            resolve(body.data);
          }
        )
    })
}

let sendTx = (options) => {
    return new Promise((resolve, reject) => {
        request({
          uri: URL + '/tx',
          method: 'GET',
          qs: {
            chain: options.chain,
            sourceAddress: options.sourceAddress,
            targetAddress: options.targetAddress,
            privateKey: options.privateKey,
            amount: options.amount,
            fee: options.fee
          },
          json: true
        },
          (error, response, body) => {
            if(error) reject(error);
            resolve(body.txId);
          }
        )
    })
}

let getBalance = (chain, address) => {
    return new Promise((resolve, reject) => {
        request({
          uri: URL + '/balance',
          method: 'GET',
          qs: {
            chain: chain,
            address: address
          },
          json: true
        },
          (error, response, body) => {
            if(error) reject(error);
            resolve(body.balance);
          }
        )
    })
}