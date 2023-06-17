// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTyLoansAdmin is Ownable, ReentrancyGuard {

    // mapping for NFT contract whitelisting 
    mapping(address => bool) public isNFTWhitelisted;

    // maximum duration of loan in seconds
    uint256 public maxLoanDuration = 53 weeks;

    // maximum active loan limit
    uint256 public maxActiveLoanLimit;

    constructor() public {
    }

    /**
     * @return the name of the NFTyLoanToken
     */
    function name() external pure returns(string memory) {
        return "NFTyLoanToken";
    }

    /** 
     * @return the symbol of the NFTyLoanToken
     */
    function symbol() external pure returns(string memory) {
        return "NFTLT";
    }

    /**
     * @dev maxActiveLoanLimit, which limits the amount of active loans that can exist at any given time
     */ 
    function setMaxActiveLoanLimit(uint256 loanLimit_) public onlyOwner {
        maxActiveLoanLimit = loanLimit_;
    }

    /**
     * @dev Sets maxLoanDuration, which limits the maximum duration of a loan
     */ 
    function setMaxLoanDuration(uint256 loanDuration_) public onlyOwner {
        // Ensure loan duration is less than or equal to the maximum allowed uint32 value
        require(loanDuration_ <= type(uint32).max, "CAN'T_BE_MORE_THAN_MAX_DURATION");
        maxLoanDuration = loanDuration_;
    }

    /**
     * @dev Adds or removes an NFT contract from the whitelist
     */ 
    function whitelistNFTContract(address nftContract_, bool whitelisting_) public onlyOwner {
        require(nftContract_ != address(0), "INVALID_ADDRESS");
        isNFTWhitelisted[nftContract_] = whitelisting_;
    }
}