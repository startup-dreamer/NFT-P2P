// Import necessary modules from Hardhat
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("ValidationUtils", function () {
  let validationUtils;

  let borrower;
  let lender;
  const chainId = 31337; // Sample chain ID for testing

  before(async function () {
    const accounts = await ethers.getSigners();
    [borrower, lender] = accounts;
  });

  // Deploy a new ValidationUtils contract before each test
  beforeEach(async function () {
    const ValidationUtils = await ethers.getContractFactory("ValidationUtils");
    validationUtils = await ValidationUtils.deploy();
    await validationUtils.deployed();
  });

  describe("isValidBorrowSignature", function () {
    it("should return true for a valid signature", async function () {
      // Sign the message with the borrower's private key
      const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [borrower.address, chainId]));
      const signedMessage = await ethers.provider.send("eth_sign", [(borrower.address).toString(), ethers.utils.hexlify(message)]);
      // Call the isValidBorrowSignature function and check that it returns true
      expect(await validationUtils.isValidBorrowSignature((borrower.address).toString(), signedMessage)).to.be.true;
    });

    it("should return false for an invalid signature", async function () {
      // Sign the message with a different address's private key
      const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [borrower.address, chainId]));
      const signedMessage = await ethers.provider.send("eth_sign", [(borrower.address).toString(), ethers.utils.hexlify(message)]);
      // Call the isValidBorrowSignature function and check that it returns false
      expect(await validationUtils.isValidBorrowSignature((borrower.address).toString(), signedMessage)).to.be.false;
    });

    it("should return false for an address of zero", async function () {
      // Call the isValidBorrowSignature function with an address of zero and check that it returns false
      expect(await validationUtils.isValidBorrowSignature("0x0000000000000000000000000000000000000000", "0x00")).to.be.false;
    });
  });

  describe("isValidLenderSignature", function () {
    it("should return true for a valid signature", async function () {
      // Sign the message with the lender's private key
      const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [lender.address, chainId]));
      const signedMessage = await ethers.provider.send("eth_sign", [(lender.address).toString(), ethers.utils.hexlify(message)]);
      // Call the isValidLenderSignature function and check that it returns true
      expect(await validationUtils.isValidLenderSignature((lender.address).toString(), signedMessage)).to.be.true;
    });

    it("should return false for an invalid signature", async function () {
      // Sign the message with a different address's private key
      const message = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address", "uint256"], [lender.address, chainId]));
      const signedMessage = await ethers.provider.send("eth_sign", [(lender.address).toString(), ethers.utils.hexlify(message)]);
      // Call the isValidLenderSignature function and check that it returns false
      expect(await validationUtils.isValidLenderSignature((lender.address).toString(), signedMessage)).to.be.false;
    });

    it("should return false for an address of zero", async function () {
      // Call the isValidLenderSignature function with an address of zero and check that it returns false
      expect(await validationUtils.isValidLenderSignature("0x0000000000000000000000000000000000000000", "0x00")).to.be.false;
    });
  });
});
