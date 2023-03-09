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
    // Load in data from text files
    netNodeStruct = await loadNetworkStructure();
    network = await loadNetwork();
    inputs = await loadInput();
    await connectNetwork();

    // Display nodes on html page
    for(let i = 0; i < network.length; i++) {
        $(document).ready(function() {
            $('#annContainer').append(
                $('<div>').prop({
                    id: 'x'+i,
                    className: 'x-axis'
                })
            );
        });
        for (let n of network[i]) {
            $(document).ready(function() {
                $('#x'+i).append(
                    $('<div>').prop({
                        className: 'node',
                        innerHTML: n.collector
                    })
                );
            });
        }
    }
}

// Loads the network structure from the txt file
function loadNetworkStructure() {
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

// Creates the network list from the network structure
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

// Loads the inputs into the network from the txt file
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

// Connects the network together and determines the collector values
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