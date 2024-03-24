// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Votes, ERC20Permit } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

interface ISFS {
  function assign(uint256 _tokenId) external returns (uint256);
}

contract MemeToken is ERC20, Ownable, ERC20Votes {
  address public minter;

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
    require(msg.sender == minter, "Only minter can mint");
    _mint(_to, _amount);
  }

  // OWNER

  function removeMinterAndRenounce() external onlyOwner {
    minter = address(0);
    emit MinterAddressChanged(msg.sender, address(0));

    renounceOwnership();
  }

  function setMinter(address _minter) external onlyOwner {
    minter = _minter;
    emit MinterAddressChanged(msg.sender, _minter);
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
