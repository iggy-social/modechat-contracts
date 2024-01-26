// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

/// @title Mock SFS contract
/// @author Tempe Techie
/// @notice Mock SFS contract for testing purposes
contract MockSFS {
  function register(address _recipient) external returns (uint256 tokenId) {
    return 123;
  }

  function assign(uint256 _tokenId) external returns (uint256) {
    return _tokenId;
  }
}