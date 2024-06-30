// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Inskribbl} from "../src/Inskribbl.sol";

contract Deploy is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        Inskribbl game = new Inskribbl(0.001 ether);
        vm.stopBroadcast();

        console.log("contract adddress", address(game));
    }
}
