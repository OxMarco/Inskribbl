#!/bin/bash

export RPC_URL=http://127.0.0.1:8545

# Actors
export DEPLOYER_PUBLIC_KEY=0xa0Ee7A142d267C1f36714E4a8F75612F20a79720
export DEPLOYER_PRIVATE_KEY=0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6

# Deploy contracts
ETH_FEE=10000000000000000
GAME=$(forge create src/Inskribbl.sol:Inskribbl --constructor-args $ETH_FEE --rpc-url=$RPC_URL --private-key=$DEPLOYER_PRIVATE_KEY)
export GAME_ADDRESS=$(echo "$GAME" | grep "Deployed to:" | awk '{print $3}')

curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"method":"anvil_setBalance","params":["0x35d389B751943Cbf3fE3620a668566E97D5f0144", "0x021e19e0c9bab2400000"],"id":1,"jsonrpc":"2.0"}'
curl http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"method":"anvil_setBalance","params":["0x3F004647c24645b50ECF85217482597304eC9e9C", "0x021e19e0c9bab2400000"],"id":1,"jsonrpc":"2.0"}'

# Print out contract address
echo " "
echo "---------------------------------------------------------------------------"
echo "Inskribbl game contract deployed to $GAME_ADDRESS"
echo "---------------------------------------------------------------------------"
