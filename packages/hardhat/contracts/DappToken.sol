// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DappToken is ERC20, Ownable {
    constructor() ERC20("DappToken", "DAPP") Ownable(msg.sender) {}

    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }

    function claim() external {
        _mint(msg.sender, 1000 ether);
    }
}