// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface IToken is IERC20 {
  function mint(address to, uint256 amount) external;
}

interface ISFS {
  function assign(uint256 _tokenId) external returns (uint256);
}

contract MemeTokenMinter is Ownable {
  address public immutable memeToken;
  bool public paused = false;
  
  mapping(address => bool) public isMinter; // addresses that have minting privileges

  // CONSTRUCTOR
  constructor(
    address memeToken_,
    address sfsAddress_,
    uint256 sfsNftId_
  ) {
    ISFS(sfsAddress_).assign(sfsNftId_);
    
    memeToken = memeToken_;
  }

  // MINTER

  function mint(address _to, uint256 _amount) external {
    require(!paused, "TokenMinter: minting is paused");
    require(isMinter[msg.sender], "TokenMinter: only minters can mint");

    IToken(memeToken).mint(_to, _amount);
  }

  // OWNER

  function addMinter(address _minter) external onlyOwner {
    isMinter[_minter] = true;
  }

  function removeMinter(address _minter) external onlyOwner {
    isMinter[_minter] = false;
  }

  function togglePaused() external onlyOwner {
    paused = !paused;
  }
}