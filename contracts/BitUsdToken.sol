// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BitUsdToken is ERC20 {
    uint256 TO_WEI = 10**18;

    constructor() public ERC20("BitUsd Token", "BITUSD") {
        _mint(msg.sender, 1000000 * TO_WEI);
    }
}
