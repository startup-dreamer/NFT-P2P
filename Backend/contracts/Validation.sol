// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract ValidationUtils {
    using ECDSA for bytes32;

    /**
     * @return Chain ID to prevent replay attacks 
     */
    function getChainId() internal view returns(uint256) {
        return block.chainid;
    }

    /**
     * @dev Ensures the validity of a borrow signature.
     * @param borrower_ Address of the borrower.
     * @param borrowSignature_ Borrower's signature.
     * @return A boolean indicating whether the given signature is valid for the given borrower.
     */
    function isValidBorrowSignature(address borrower_, bytes memory borrowSignature_) public view returns(bool) {
        if(borrower_ == address(0)) {
            return false;
        }
        else {
            uint256 chainId;
            chainId = getChainId();
            bytes32 message = keccak256(abi.encodePacked(borrower_, chainId));
            bytes32 signedMessageHash = message.toEthSignedMessageHash();
            address sender = signedMessageHash.recover(borrowSignature_);
            return(sender == borrower_);
        }
    }

    /**
     * @dev Ensures the validity of a lender signature.
     * @param lender_ Address of the lender.
     * @param lenderSignature_ Lender's signature.
     * @return A boolean indicating whether the given signature is valid for the given lender.
     */
    function isValidLenderSignature(address lender_, bytes memory lenderSignature_) public view returns(bool) {
        if(lender_ == address(0)) {
            return false;
        }
        else {
            uint256 chainId = getChainId();
            bytes32 message = keccak256(abi.encodePacked(lender_, chainId));
            bytes32 signedMessageHash = message.toEthSignedMessageHash();
            address sender = signedMessageHash.recover(lenderSignature_);
            return(sender == lender_);
        }
    }
}
