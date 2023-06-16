// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTLoanContract {
    struct Loan {
        address borrower;
        address lender;
        address nftContract;
        uint256 tokenId;
        uint256 loanAmount;
        uint256 interestRate; // in basis points (1 basis point = 0.01%)
        uint256 duration; // in seconds
        uint256 startTime;
        bool active;
    }

    mapping(uint256 => Loan) public loans;
    uint256 public loanCount;

    function createLoan(
        address _nftContract,
        uint256 _tokenId,
        uint256 _loanAmount,
        uint256 _interestRate,
        uint256 _duration
    ) external {
        require(_loanAmount > 0, "Loan amount must be greater than zero");
        require(_duration > 0, "Loan duration must be greater than zero");
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Only the NFT owner can create a loan"
        );

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);

        Loan storage newLoan = loans[loanCount];
        newLoan.borrower = msg.sender;
        newLoan.nftContract = _nftContract;
        newLoan.tokenId = _tokenId;
        newLoan.loanAmount = _loanAmount;
        newLoan.interestRate = _interestRate;
        newLoan.duration = _duration;
        newLoan.startTime = block.timestamp;
        newLoan.active = true;

        loanCount++;
    }

    function acceptLoanOffer(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(loan.active, "Loan is not active");

        IERC20 stablecoin = IERC20(address(0x123...)); // Address of stablecoin contract

        uint256 interestAmount = (loan.loanAmount * loan.interestRate) / 10000;
        uint256 totalAmount = loan.loanAmount + interestAmount;

        stablecoin.transferFrom(msg.sender, address(this), totalAmount);
        stablecoin.transfer(loan.borrower, loan.loanAmount);
        stablecoin.transfer(loan.lender, interestAmount);

        loan.active = false;
    }

    function retrieveNFT(uint256 _loanId) external {
        Loan storage loan = loans[_loanId];
        require(!loan.active, "Loan is still active");
        require(msg.sender == loan.borrower || msg.sender == loan.lender, "Only borrower or lender can retrieve NFT");

        IERC721(loan.nftContract).transferFrom(address(this), msg.sender, loan.tokenId);
    }
}
