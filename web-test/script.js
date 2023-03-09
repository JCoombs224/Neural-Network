class Node {
    collector = 0;
    constructor(connections) {
        this.connections = connections;
    }
}

window.onload = function() {
    main();
}

netNodeStruct = [];
network = [];
inputs = [];

async function main() {
    netNodeStruct = await load();
    network = await loadNetwork();
    inputs = await loadInput();
    await connectNetwork();

    
}

function load() {
    return new Promise((resolve, reject) => {
        res = [];
        networkFr = new XMLHttpRequest();
        networkFr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                // this code runs when the file is opened
            temp = networkFr.responseText.split(',');
            for (let t of temp) {
                res.push(Number(t.trim()));
            }
            resolve(res);
            }
        }
        networkFr.open("GET","network.txt",true);
        networkFr.send();
    }) 
}

function loadNetwork() {
    return new Promise((resolve, reject) => {
        res = [];
        setTimeout(() => {
            lastLayer = null;
            for (let i of netNodeStruct) {
                tmp = [];
                for (let j=0; j < i; j++) {
                    tmp.push(new Node(lastLayer));
                }
                res.push(tmp);
                lastLayer = tmp;
            }
            resolve(res)
          }, 250)
    });
}

function loadInput() {
    return new Promise((resolve, reject) => {
        res = [];
        inputFr = new XMLHttpRequest();
        inputFr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) { 
                temp = inputFr.responseText.split(',');
            for (let t of temp) {
                res.push(Number(t.trim()))
            }
                resolve(res);
            }
        }
        inputFr.open("GET","input.txt",true);
        inputFr.send();
    });
}

function connectNetwork() {
    return new Promise((resolve, reject) => { 
        for(let i = 0; i < inputs.length; i++) {
            network[0][i].collector = Number(inputs[i]*1);
        }

        for(let i = 1; i < inputs.length-1; i++) {
            for (let n of network[i]) {
                for (let c of n.connections) {
                    n.collector = n.collector + c.collector
                }
            }
        }
        resolve();
    });
}