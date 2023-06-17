// Import necessary modules from Hardhat
const { ethers } = require("hardhat");
const { expect } = require("chai");


describe("NFTyLoansAdmin", function () {
    let contract;
  beforeEach(async function () {
    // Deploy contract before each test
    contract = await (await ethers.getContractFactory("NFTyLoansAdmin")).deploy();
    await contract.deployed();
  });

  it("should have a name and symbol", async function () {
    const name = await contract.name();
    const symbol = await contract.symbol();
    expect(name).to.equal("NFTyLoanToken");
    expect(symbol).to.equal("NFTLT");
  });

  it("should be able to set max active loan limit", async function () {
    await contract.setMaxActiveLoanLimit(10);
    const loanLimit = await contract.maxActiveLoanLimit();
    expect(loanLimit).to.equal(10);
  });

  it("should be able to set max loan duration", async function () {
    await contract.setMaxLoanDuration(10000);
    const loanDuration = await contract.maxLoanDuration();
    expect(loanDuration).to.equal(10000);
  });

  it("should be able to add an NFT contract to the whitelist", async function () {
    const nftContract = ethers.utils.getAddress("0x0000000000000000000000000000000000000400");
    await contract.whitelistNFTContract(nftContract, true);
    const isWhitelisted = await contract.isNFTWhitelisted(nftContract);
    expect(isWhitelisted).to.equal(true);
  });

  it("should be able to remove an NFT contract from the whitelist", async function () {
    const nftContract = ethers.utils.getAddress("0x0000000000000000000000000000000000000400");
    await contract.whitelistNFTContract(nftContract, true);
    await contract.whitelistNFTContract(nftContract, false);
    const isWhitelisted = await contract.isNFTWhitelisted(nftContract);
    expect(isWhitelisted).to.equal(false);
  });
});
