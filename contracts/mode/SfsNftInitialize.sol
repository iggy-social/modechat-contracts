// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { OwnableWithManagers } from "../access/OwnableWithManagers.sol";
import { ISFS } from "./ISFS.sol";

/// @title SFS NFT generator contract
/// @author Tempe Techie
/// @notice Contract that generates the Mode SFS NFT
contract SfsNftInitialize is OwnableWithManagers { 
  uint256 public immutable sfsNftTokenId;

  // CONSTRUCTOR
  constructor(address sfsAddress_, address feeReceiver_) {
    // Testnet SFS addr: 0xBBd707815a7F7eb6897C7686274AFabd7B579Ff6, mainnet: 0x8680CEaBcb9b56913c519c069Add6Bc3494B7020
    sfsNftTokenId = ISFS(sfsAddress_).register(feeReceiver_);
  }
  
}