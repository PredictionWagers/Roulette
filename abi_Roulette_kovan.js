var gobjAbi_Roulette_kovan = [
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "HouseAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "PlayerAddress",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "TimeStamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "int256",
                "name": "CreditOrDebit",
                "type": "int256"
            }
        ],
        "name": "evtReport",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "sUsername",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "nMaxPayoutPerSpin",
                "type": "uint256"
            }
        ],
        "name": "zCreateHouse",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "zGetHouses",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "asAddresses",
                "type": "address[]"
            },
            {
                "internalType": "bytes32[]",
                "name": "asUsernames",
                "type": "bytes32[]"
            },
            {
                "internalType": "uint256[]",
                "name": "anBalances",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "anMaxPayoutPerSpins",
                "type": "uint256[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "zGetWinningNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "nWinningNumber",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "zGetgb32Random",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "b32Random",
                "type": "bytes32"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [],
        "name": "zKill",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "b32Random",
                "type": "bytes32"
            }
        ],
        "name": "zSetgb32Random",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "nChipValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nHouseID",
                "type": "uint256"
            },
            {
                "internalType": "bool[]",
                "name": "gbaAllSpaces",
                "type": "bool[]"
            }
        ],
        "name": "zSpinWheel",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "sUsername",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "nMaxPayoutPerSpin",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nWithdrawal",
                "type": "uint256"
            }
        ],
        "name": "zUpdateHouse",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
    }
]