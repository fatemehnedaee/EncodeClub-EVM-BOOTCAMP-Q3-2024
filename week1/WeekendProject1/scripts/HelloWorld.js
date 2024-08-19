const { expect } = require("chai");
const hre = require("hardhat");

describe("HelloWorld", function () {
  async function deployOneYearLockFixture() {

    const helloWorld = await hre.ethers.deployContract("HelloWorld");
    return { helloWorld };
  }

  it("Should set the right unlockTime", async function () {
    const { helloWorld } = await loadFixture(deployOneYearLockFixture);

    // assert that the value is correct
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

});