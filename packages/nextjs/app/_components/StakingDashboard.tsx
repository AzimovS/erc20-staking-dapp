import React, { useState } from "react";
import { ActionButton } from "./ActionButton";
import { StatCard } from "./StatCard";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

const StakingDashboard: React.FC = () => {
  const { address } = useAccount();
  const [isAirdropClaiming, setIsAirdropClaiming] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "DappToken",
    functionName: "balanceOf",
    args: [address],
  });

  const { data: stakingInfo } = useScaffoldReadContract({
    contractName: "ERC20Staking",
    functionName: "stakes",
    args: [address],
  });

  const { data: tokenReward } = useScaffoldReadContract({
    contractName: "ERC20Staking",
    functionName: "claimableRewards",
    args: [address],
  });

  const { writeContractAsync: writeTokenContractAsync } = useScaffoldWriteContract({
    contractName: "DappToken",
  });

  const { writeContractAsync: writeStakingContractAsync } = useScaffoldWriteContract({
    contractName: "ERC20Staking",
  });

  const handleAirdrop = async () => {
    try {
      setIsAirdropClaiming(true);
      await writeTokenContractAsync(
        { functionName: "claim" },
        { onBlockConfirmation: () => setIsAirdropClaiming(false) },
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      notification.error(`Error claiming airdrop: ${errorMessage}`);
      setIsAirdropClaiming(false);
    }
  };

  const handleClaim = async () => {
    try {
      setIsClaiming(true);
      await writeStakingContractAsync(
        { functionName: "claimReward" },
        { onBlockConfirmation: () => setIsClaiming(false) },
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      notification.error(`Error claiming rewards: ${errorMessage}`);
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="my-0">Your Staking Dashboard</p>
      <div className="stats bg-base-100 shadow">
        <StatCard
          title="Token Balance"
          value={tokenBalance ? formatEther(tokenBalance) : "0"}
          action={
            <ActionButton
              onClick={handleAirdrop}
              isLoading={isAirdropClaiming}
              loadingText="Claiming..."
              defaultText="Airdrop"
              disabled={isAirdropClaiming}
            />
          }
        />
        <StatCard title="Staked Amount" value={stakingInfo?.[0] ? formatEther(stakingInfo[0]) : "0"} />
        <StatCard
          title="Rewards"
          value={tokenReward ? formatEther(tokenReward) : "0"}
          action={
            <ActionButton
              onClick={handleClaim}
              isLoading={isClaiming}
              loadingText="Claiming..."
              defaultText="Claim"
              disabled={isClaiming}
            />
          }
        />
      </div>
    </div>
  );
};

export default StakingDashboard;
