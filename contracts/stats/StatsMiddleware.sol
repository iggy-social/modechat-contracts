// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { OwnableWithManagers } from "../access/OwnableWithManagers.sol";

interface ISFS {
  function assign(uint256 _tokenId) external returns (uint256);
}

interface IStats {
  function addWeiSpent(address user_, uint256 weiSpent_) external;
  function getWeiSpent(address user_) external view returns (uint256);
  function weiSpentTotal() external view returns (uint256);
}

/** 
@title Stats Middleware
@author Tempe Techie
*/
contract StatsMiddleware is OwnableWithManagers {
  address public statsAddress;
  mapping (address => bool) public writers; // writer contracts that can send stats to this contract

  // CONSTRUCTOR
  constructor(address sfsAddress_, uint256 tokenId_, address statsAddress_) {
    ISFS(sfsAddress_).assign(tokenId_);
    statsAddress = statsAddress_;
  }

  // READ

  function getWeiSpent(address user_) external view returns (uint256) {
    return IStats(statsAddress).getWeiSpent(user_);
  }

  function weiSpentTotal() external view returns (uint256) {
    return IStats(statsAddress).weiSpentTotal();
  }

  // WRITER

  function addWeiSpent(address user_, uint256 weiSpent_) external {
    require(writers[msg.sender], "Not a writer contract");
    
    IStats(statsAddress).addWeiSpent(user_, weiSpent_);
  }

  function addWriterByWriter(address writer_) external {
    require(writers[msg.sender], "Not a writer contract");
    writers[writer_] = true;
  }
  
  // OWNER
  function addWriter(address writer_) external onlyManagerOrOwner {
    writers[writer_] = true;
  }

  function removeWriter(address writer_) external onlyManagerOrOwner {
    writers[writer_] = false;
  }

  function setStatsAddress(address statsAddress_) external onlyManagerOrOwner {
    statsAddress = statsAddress_;
  }

}