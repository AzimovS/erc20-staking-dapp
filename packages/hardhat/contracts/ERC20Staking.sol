// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Staking {
    IERC20 public stakingToken;
    uint256 public rewardRate;

    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 rewardDebt;
    }

    mapping(address => Stake) public stakes;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _stakingToken, uint256 _rewardRate) {
        stakingToken = _stakingToken;
        rewardRate = _rewardRate;
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake zero tokens");
        require(stakingToken.transferFrom(msg.sender, address(this), amount), "Stake failed");

        Stake storage userStake = stakes[msg.sender];
        if (userStake.amount > 0) {
            userStake.rewardDebt += _calculateReward(msg.sender);
        }

        userStake.amount += amount;
        userStake.startTime = block.timestamp;

        emit Staked(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        Stake storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked amount");

        userStake.rewardDebt += _calculateReward(msg.sender);
        userStake.amount -= amount;
        stakingToken.transfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() external {
        Stake storage userStake = stakes[msg.sender];
        uint256 reward = _calculateReward(msg.sender) + userStake.rewardDebt;
        require(reward > 0, "No rewards to claim");

        userStake.rewardDebt = 0;
        userStake.startTime = block.timestamp;
        stakingToken.transfer(msg.sender, reward);

        emit RewardClaimed(msg.sender, reward);
    }

    function claimableRewards(address user) external view returns (uint256) {
        return _calculateReward(user) + stakes[user].rewardDebt;
    }

    function _calculateReward(address user) internal view returns (uint256) {
        Stake storage userStake = stakes[user];
        return (userStake.amount * rewardRate * (block.timestamp - userStake.startTime)) / 1e18;
    }
}