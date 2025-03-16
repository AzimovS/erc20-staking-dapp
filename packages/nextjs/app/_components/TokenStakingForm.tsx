import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldContract, useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

export const TokenStakingForm = () => {
  const { address } = useAccount();
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { data: stakingContract } = useScaffoldContract({
    contractName: "ERC20Staking",
  });

  const { data: allowedStakeTokens } = useScaffoldReadContract({
    contractName: "DappToken",
    functionName: "allowance",
    args: [address, stakingContract?.address],
  });

  const { writeContractAsync: writeTokenContractAsync } = useScaffoldWriteContract({ contractName: "DappToken" });
  const { writeContractAsync: writeStakingContractAsync } = useScaffoldWriteContract({ contractName: "ERC20Staking" });

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      const amount = parseEther(stakeAmount);
      await writeTokenContractAsync(
        { functionName: "approve", args: [stakingContract?.address, amount] },
        { onBlockConfirmation: () => setIsApproving(false) },
      );
    } catch (error) {
      console.error("Error approving tokens: ", error);
      notification.error("Error approving tokens");
      setIsApproving(false);
    }
  };

  const handleStake = async () => {
    try {
      setIsStaking(true);
      const amount = parseEther(stakeAmount);
      await writeStakingContractAsync(
        { functionName: "stake", args: [amount] },
        { onBlockConfirmation: () => setIsStaking(false) },
      );
      setStakeAmount("");
    } catch (error) {
      console.error("Error staking tokens: ", error);
      notification.error("Error staking tokens");
      setIsStaking(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setIsWithdrawing(true);
      const amount = parseEther(withdrawAmount);
      await writeStakingContractAsync(
        { functionName: "withdraw", args: [amount] },
        { onBlockConfirmation: () => setIsWithdrawing(false) },
      );
      setWithdrawAmount("");
    } catch (error) {
      console.error("Error withdrawing tokens: ", error);
      notification.error("Error withdrawing tokens");
      setIsWithdrawing(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-8">
      <div>
        <label className="label">
          <span className="label-text">Stake Amount</span>
        </label>
        <div className="flex">
          <IntegerInput
            value={stakeAmount}
            onChange={setStakeAmount}
            placeholder="Amount to stake"
            disableMultiplyBy1e18
          />
          {(allowedStakeTokens || 0n) < parseEther(stakeAmount) ? (
            <button
              className={`btn btn-sm btn-primary my-auto ${isApproving ? "loading" : ""}`}
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve"}
            </button>
          ) : (
            <button
              className={`btn btn-sm btn-primary my-auto ${isStaking ? "loading" : ""}`}
              onClick={handleStake}
              disabled={isStaking}
            >
              {isStaking ? "Staking..." : "Stake"}
            </button>
          )}
        </div>
      </div>

      <div>
        <label className="label">
          <span className="label-text">Withdraw Amount</span>
        </label>
        <div className="flex">
          <IntegerInput
            value={withdrawAmount}
            onChange={setWithdrawAmount}
            placeholder="Amount to withdraw"
            disableMultiplyBy1e18
          />
          <button
            className={`btn btn-sm btn-primary my-auto ${isWithdrawing ? "loading" : ""}`}
            onClick={handleWithdraw}
            disabled={isWithdrawing}
          >
            {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </button>
        </div>
      </div>
    </div>
  );
};
