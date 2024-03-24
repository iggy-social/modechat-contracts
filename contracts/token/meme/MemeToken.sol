// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes, ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface ISFS {
  function assign(uint256 _tokenId) external returns (uint256);
}

contract MemeToken is ERC20, Ownable, ERC20Votes {
  uint256 public deadline; // timestamp when the token minting ends (see mintStart() function)

  mapping(address => bool) public isMinter; // addresses that have minting privileges

  // EVENTS
  event MinterAddressChanged(address indexed _owner, address indexed _minter);

  // CONSTRUCTOR
  constructor(
    string memory name_, 
    string memory symbol_,
    address sfsAddress_,
    uint256 sfsNftId_
  ) ERC20(name_, symbol_) ERC20Permit(name_) {
    ISFS(sfsAddress_).assign(sfsNftId_);
  }

  // READ

  // Overrides IERC6372 functions to make the token & governor timestamp-based
  function clock() public view override returns (uint48) {
    return uint48(block.timestamp);
  }

  // Overrides IERC6372 functions to make the token & governor timestamp-based
  function CLOCK_MODE() public pure override returns (string memory) { // solhint-disable-line func-name-mixedcase
    return "mode=timestamp";
  }

  // MINTER

  function mint(address _to, uint256 _amount) external {
    require(deadline == 0, "Minting is paused");
    require(isMinter[msg.sender], "Only minters can mint");
    require(block.timestamp < deadline, "Minting period has ended");

    _mint(_to, _amount);
  }

  // OWNER

  function addMinter(address _minter) external onlyOwner {
    isMinter[_minter] = true;
  }

  function removeMinter(address _minter) external onlyOwner {
    isMinter[_minter] = false;
  }

  function mintStart() external onlyOwner {
    deadline = block.timestamp + 2 weeks; // minting period is 2 weeks
  }

  // INTERNAL (ERC20Votes requirements)

  function _afterTokenTransfer(
    address from, 
    address to, 
    uint256 amount
  ) internal override(ERC20, ERC20Votes) {
    super._afterTokenTransfer(from, to, amount);
  }

  function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._burn(account, amount);
  }

  function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
    super._mint(to, amount);
  }

}
