"use client";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { hexToString } from "viem";
import { useAccount, useReadContract, useWriteContract } from "wagmi";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            {/* <span className="block text-2xl mb-2">Welcome to</span> */}
            <span className="block text-4xl font-bold">Voting-Dapp</span>
          </h1>
          {/* <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/pages/index.tsx
            </code>
          </p> */}
          <PageBody></PageBody>
        </div>
      </div>
    </>
  );
};

function PageBody() {
  return (
    <>
      <WalletInfo></WalletInfo>
    </>
  );
}

function WalletInfo() {
  const { address, isConnecting, isDisconnected } = useAccount();
  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <TokenInfo address={address as `0x${string}`}></TokenInfo>
        <Delegation address={address as `0x${string}`}></Delegation>
        <Minting address={address as `0x${string}`}></Minting>
        <Voting address={address as `0x${string}`}></Voting>
        <QueryResults></QueryResults>
        <></>
      </div>
    );
  if (isConnecting)
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  if (isDisconnected)
    return (
      <div>
        <p>Wallet disconnected. Connect wallet to continue</p>
      </div>
    );
  return (
    <div>
      <p>Connect wallet to continue</p>
    </div>
  );
}

function TokenInfo(params: { address: `0x${string}` }) {
  return (
    <div className="card w-100 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <TokenName></TokenName>
        <TokenBalance address={params.address}></TokenBalance>
        <TokenAddressFromApi></TokenAddressFromApi>
      </div>
    </div>
  );
}

function TokenName() {
  const { chain } = useAccount();
  const { data, isError, isLoading } = useReadContract({
    address: "0xe8e5E16e46023DDb687a6E037168Bd39f8d7e362",
    abi: [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            name: "",
            type: "string",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "name",
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching name…</div>;
  if (isError) return <div>Error fetching name</div>;
  return <div>Token name: {name} on {chain?.name} network</div>;
}

function TokenBalance(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0xe8e5E16e46023DDb687a6E037168Bd39f8d7e362",
    abi: [
      {
        constant: true,
        inputs: [
          {
            name: "_owner",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            name: "balance",
            type: "uint256",
          },
        ],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
    ],
    functionName: "balanceOf",
    args: [params.address],
  });

  const balance = data ? Number(data) : 0;

  if (isLoading) return <div>Fetching balance…</div>;
  if (isError) return <div>Error fetching balance</div>;
  return <div>Balance: {balance} MTK</div>;
}

function TokenAddressFromApi() {
  const [data, setData] = useState<{ result: string }>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3001/token-contract-address")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading token address from API...</p>;
  if (!data) return <p>No token address information</p>;

  return (
    <div>
      <p>Token address contract: {data.result}</p>
    </div>
  );
}

function Delegation(params: { address: `0x${string}` }) {
  const [address, setAddress] = useState('');
  return (
    <div className="card w-100 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <GetCurrentVotePower address={params.address}></GetCurrentVotePower>
        <input
          type="text"
          placeholder="0X..."
          className="btn"
          value={address}
          onChange={e => setAddress(e.target.value)}
        >
        </input>
        <Delegate address={address}></Delegate>
      </div>
    </div>
  );
}

function GetCurrentVotePower(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0xe8e5E16e46023DDb687a6E037168Bd39f8d7e362",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "getVotes",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
    ],
    functionName: "getVotes",
    args: [params.address],
  });

  const currentVotePower = data ? Number(data) : 0;

  if (isLoading) return <div>Fetching current vote power…</div>;
  if (isError) return <div>Error fetching current vote power.</div>;
  if (currentVotePower === 0)
    return (
      <div>
        <p>Your current vote power is zero!</p>
        <p>You can not delegate.</p>
      </div>
    )
  return (
    <p>Current Vote Power: {currentVotePower}</p>
  );
}

function Delegate(params: { address: string }) {
  const { data: hash, writeContract } = useWriteContract();
  if (!hash)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          writeContract({
            address: '0xe8e5E16e46023DDb687a6E037168Bd39f8d7e362',
            abi: [
              {
                inputs: [
                  {
                    internalType: "address",
                    name: "delegatee",
                    type: "address"
                  }
                ],
                name: "delegate",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
              },
            ],
            functionName: 'delegate',
            args: [params.address],
          })
        }}
      >
        Delegate
      </button>
    )
  return (
    <div>
      <p>Delegated to {params.address}</p>
      <p>Transaction Hash: {hash}</p>
    </div>
  );
}

function Minting(params: { address: `0x${string}` }) {
  const [amount, setAmount] = useState('');
  return (
    <div className="card w-100 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <input
          type="text"
          placeholder="Enter amount for mint"
          className="btn"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        >
        </input>
        <Mint address={params.address} amount={amount} ></Mint>
      </div>
    </div>
  );
}

function Mint(params: { address: string, amount: string }) {
  const [data, setData] = useState<{ result: any }>();
  const [isLoading, setLoading] = useState(false);

  const body = { address: params.address, amount: params.amount };

  if (isLoading) return <p>Requesting tokens from API...</p>;
  if (!data)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          setLoading(true);
          fetch("http://localhost:3001/mint-tokens", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
            .then((res) => res.json())
            .then((data) => {
              setData(data);
              setLoading(false);
            });
        }}
      >
        Mint
      </button>
    );
  return (
    <div>
      <p>{data.result.status ? `Minted ${params.amount} MTK to ${params.address} .` : "Mint failed"}</p>
      <p>Transaction Hash: {data.result.txHash ? data.result.txHash : "ERROR"}</p>
    </div>
  );
}

function Voting(params: { address: `0x${string}` }) {
  const [index, setIndex] = useState('');
  const [voteCount, setVoteCount] = useState('');
  return (
    <div className="card w-100 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <GetPastVotePower address={params.address}></GetPastVotePower>
        <Proposals></Proposals>
        <input
          type="text"
          placeholder="Proposal Index"
          className="btn"
          value={index}
          onChange={e => setIndex(e.target.value)}
        >
        </input>
        <input
          type="text"
          placeholder="Vote Count"
          className="btn"
          value={voteCount}
          onChange={e => setVoteCount(e.target.value)}
        >
        </input>
        <CastVote index={BigInt(index)} voteCount={BigInt(voteCount)}></CastVote>
      </div>
    </div>
  );
}

function GetPastVotePower(params: { address: `0x${string}` }) {
  const { data, isError, isLoading } = useReadContract({
    address: "0x34fa53e700da231781f64b48b22373f1db92d359",
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "voter",
            type: "address"
          }
        ],
        name: "getVotPower",
        outputs: [
          {
            internalType: "uint256",
            name: "votePower",
            type: "uint256"
          }
        ],
        stateMutability: "view",
        type: "function"
      }
    ],
    functionName: "getVotPower",
    args: [params.address],
  });

  const pastVotePower = data ? Number(data) : 0;

  if (isLoading) return <div>Fetching vote power…</div>;
  if (isError) return <div>Error fetching vote power</div>;
  if (pastVotePower === 0)
    return (
      <div>
        <p>Your past vote power is zero!</p>
        <p>You can not vote.</p>
      </div>
    )
  return (
    <p>Past Vote Power: {pastVotePower}</p>
  );
}

function Proposals() {
  const [data, setData] = useState<{ result: any }>();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    fetch("http://localhost:3001/get-proposals")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading proposals from API...</p>;
  if (!data) return <p>No proposals information</p>;
  return (
    <div>
      <p>Proposals:</p>
      {
        data.result?.map((item: string, index: number) => <li>Proposal{index}: {item[0]}</li>)
      }
    </div>
  );
}

function CastVote(params: { index: bigint, voteCount: bigint }) {
  const { data: hash, writeContract } = useWriteContract();
  if (!hash)
    return (
      <button
        className="btn btn-active btn-neutral"
        onClick={() => {
          writeContract({
            address: '0x34fa53e700da231781f64b48b22373f1db92d359',
            abi: [
              {
                inputs: [
                  {
                    internalType: "uint256",
                    name: "proposal",
                    type: "uint256"
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256"
                  }
                ],
                name: "vote",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
              },
            ],
            functionName: 'vote',
            args: [params.index, params.voteCount],
          })
        }}
      >
        Vote
      </button>
    )
  return (
    <div>
      <p>Voted {Number(params.voteCount)} to proposal {Number(params.index)}</p>
      <p>Transaction Hash: {hash}</p>
    </div>
  );
}

function QueryResults() {
  return (
    <div className="card w-100 bg-primary text-primary-content mt-4">
      <div className="card-body">
        <WinnerName></WinnerName>
      </div>
    </div>
  )
}

function WinnerName() {
  const { data, isError, isLoading, error } = useReadContract({
    address: '0x34fa53e700da231781f64b48b22373f1db92d359',
    abi: [
      {
        inputs: [],
        name: "winnerName",
        outputs: [
          {
            internalType: "bytes32",
            name: "winnerName_",
            type: "bytes32"
          }
        ],
        stateMutability: "view",
        type: "function"
      },
    ],
    functionName: 'winnerName',
  });
  if (isLoading) return <div>Fetching winner...</div>;
  if (isError) return <div>Error fetching winner { }</div>;
  const winnerProposal = data ? data : "There is not winner!";
  return (
    <div>
      {
        winnerProposal === "There is not winner!"
          ? "There is not winner!"
          : `Winner proposal is ${hexToString(winnerProposal, { size: 32 })}`
      }
    </div>
  );
}

export default Home;