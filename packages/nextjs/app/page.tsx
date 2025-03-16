"use client";

import Link from "next/link";
import StakingDashboard from "./_components/StakingDashboard";
import { TokenStakingForm } from "./_components/TokenStakingForm";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">ERC20 Staking dApp</span>
          </h1>
        </div>

        <div className="mt-4">
          <StakingDashboard />
          <TokenStakingForm />
        </div>
      </div>
    </>
  );
};

export default Home;
