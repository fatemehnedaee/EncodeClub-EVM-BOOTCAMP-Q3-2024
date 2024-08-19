import { expect } from "chai";
import { toHex, hexToString } from "viem";
import { viem } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

async function deployContract() {
  const publicClient = await viem.getPublicClient();
  const [ deployer, account1, account2, account3, account4] = await viem.getWalletClients();
  const ballotContract = await viem.deployContract("Ballot", [PROPOSALS.map( (prop) => toHex(prop, { size: 32}))]);
  return { publicClient, deployer, account1, account2, account3, account4, ballotContract };
}

describe("Ballot", async () => {
  describe("when the contract is deployed", async () => {
    it("has the provided proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for(let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(hexToString(proposal[0], { size: 32 })).to.eq(PROPOSALS[index]);
      }
    });

    it("has zero votes for all proposals", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      for(let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.read.proposals([BigInt(index)]);
        expect(proposal[1]).to.eq(0n)
      }
    });
    it("sets the deployer address as chairperson", async () => {
      const { deployer, ballotContract } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      expect(chairperson.toLowerCase()).to.eq(deployer.account.address)
    });
    it("sets the voting weight for the chairperson as 1", async () => {
      const { ballotContract, deployer } = await loadFixture(deployContract);
      const chairperson = await ballotContract.read.chairperson();
      const chairpersonvote = await ballotContract.read.voters([chairperson]);
      expect(chairpersonvote[0]).to.eq(1n)
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("gives right to vote for another address", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([account1.account.address]);
      const account1vote = await ballotContract.read.voters([account1.account.address]);
      expect(account1vote[0]).to.be.eq(1n);
    });
    it("can not give right to vote for someone that has voted", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([account1.account.address]);
      const ballotContractAsaccount1 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account1 } }
      );
      
      await ballotContractAsaccount1.write.vote([BigInt(0)]);
      await expect(
        ballotContract.write.giveRightToVote([account1.account.address])
      ).to.be.rejectedWith("The voter already voted");
    });
    it("can not give right to vote for someone that has already voting rights", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([account1.account.address]);
      await expect(
        ballotContract.write.giveRightToVote([account1.account.address])
      ).to.be.rejected;
    });
  });

  describe("when the voter interacts with the vote function in the contract", async () => {
    it("should register the vote", async () => {
      const { deployer, ballotContract } = await loadFixture(deployContract);
      await ballotContract.write.vote([BigInt(0)]);
      const chairpersonvote = await ballotContract.read.voters([deployer.account.address]);
      const proposal0 = await ballotContract.read.proposals([BigInt(0)]);
      expect(chairpersonvote[1]).to.be.eq(true);
      expect(chairpersonvote[3]).to.be.eq(0n);
      expect(proposal0[1]).to.be.eq(chairpersonvote[0]);
    });
  });

  describe("when the voter interacts with the delegate function in the contract", async () => {
    it("should transfer voting power", async () => {
      const { ballotContract, account1, deployer } = await loadFixture(deployContract);
      await ballotContract.write.giveRightToVote([account1.account.address]);
      await ballotContract.write.delegate([account1.account.address]);
      const chairpersonvote = await ballotContract.read.voters([deployer.account.address]);
      const account1vote = await ballotContract.read.voters([account1.account.address]);
      expect(chairpersonvote[1]).to.be.eq(true);
      expect(chairpersonvote[2].toLowerCase()).to.be.eq(account1.account.address);
      expect(account1vote[0]).to.be.eq(2n);
    });
  });

  describe("when an account other than the chairperson interacts with the giveRightToVote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      const ballotContractAsaccount1 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account1 }}
      );
      await expect(
        ballotContractAsaccount1.write.giveRightToVote([account1.account.address])
      ).to.be.rejectedWith("Only chairperson can give right to vote.");
    });
  });

  describe("when an account without right to vote interacts with the vote function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      const ballotContractAsaccount1 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account1 }}
      );
      await expect(
        ballotContractAsaccount1.write.vote([BigInt(0)])
      ).to.be.rejectedWith("Has no right to vote");
    });
  });

  describe("when an account without right to vote interacts with the delegate function in the contract", async () => {
    it("should revert", async () => {
      const { ballotContract, account1 } = await loadFixture(deployContract);
      const ballotContractAsaccount1 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account1 }}
      );
      await expect(
        ballotContractAsaccount1.write.delegate([account1.account.address])
      ).to.be.rejectedWith("You have no right to vote");
    });
  });

  describe("when someone interacts with the winningProposal function before any votes are cast", async () => {
    it("should return 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const winningproposal = await ballotContract.read.winningProposal();
      expect(winningproposal).to.be.eq(0n);
    });
  });

  describe("when someone interacts with the winningProposal function after one vote is cast for the first proposal", async () => {
    it("should return 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      await ballotContract.write.vote([BigInt(1)]);
      const winningproposal = await ballotContract.read.winningProposal();
      expect(winningproposal).to.be.eq(1n);
    });
  });

  describe("when someone interacts with the winnerName function before any votes are cast", async () => {
    it("should return name of proposal 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      const winnername = await ballotContract.read.winnerName();
      expect(hexToString(winnername, { size: 32 })).to.be.eq("Proposal 1");
    });
  });

  describe("when someone interacts with the winnerName function after one vote is cast for the first proposal", async () => {
    it("should return name of proposal 0", async () => {
      const { ballotContract } = await loadFixture(deployContract);
      await ballotContract.write.vote([BigInt(1)]);
      const winnername = await ballotContract.read.winnerName();
      expect(hexToString(winnername, { size: 32 })).to.be.eq("Proposal 2");
    });
  });

  describe("when someone interacts with the winningProposal function and winnerName after 5 random votes are cast for the proposals", async () => {
    it("should return the name of the winner proposal", async () => {
      const { ballotContract, account1, account2, account3, account4 } = await loadFixture(deployContract);
      await ballotContract.write.vote([BigInt(0)]);

      await ballotContract.write.giveRightToVote([account1.account.address]);
      const ballotContractAsaccount1 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account1 }}
      );
      await ballotContractAsaccount1.write.vote([BigInt(1)]);

      await ballotContract.write.giveRightToVote([account2.account.address]);
      const ballotContractAsaccount2 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account2 }}
      );
      await ballotContractAsaccount2.write.vote([BigInt(2)]);

      await ballotContract.write.giveRightToVote([account3.account.address]);
      const ballotContractAsaccount3 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account3 }}
      );
      await ballotContractAsaccount3.write.vote([BigInt(2)]);

      await ballotContract.write.giveRightToVote([account4.account.address]);
      const ballotContractAsaccount4 = await viem.getContractAt(
        "Ballot",
        ballotContract.address,
        { client: { wallet: account4 }}
      );
      await ballotContractAsaccount4.write.vote([BigInt(2)]);

      const winningProposal = await ballotContract.read.winningProposal();
      expect(winningProposal).to.be.eq(2n);
      const winnername = await ballotContract.read.winnerName();
      expect(hexToString(winnername, { size: 32 })).to.be.eq("Proposal 3");
    });
  });
});