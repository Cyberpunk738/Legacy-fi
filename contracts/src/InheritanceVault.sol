// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InheritanceVault
 * @notice Hackathon MVP Smart Contract for InheritanceFi on Base Sepolia (Chain ID 84532).
 * Enforces authorized beneficiary allocations and handles demo inheritance distributions.
 *
 * Designed for SIBYL Labs Hackathon & Base Ecosystem.
 */
contract InheritanceVault {
    enum PayoutType { LumpSum, GradualRelease, MilestoneTrust }
    enum VaultStatus { Draft, Authorized, Activated, Distributed }

    struct BeneficiaryConfig {
        address wallet;
        uint256 allocationBasisPoints; // e.g., 4000 = 40.00%, 3000 = 30.00%
        PayoutType payoutType;
        uint256 releasedAmount;
        bool exists;
    }

    address public owner;
    VaultStatus public status;
    uint256 public totalVaultBalance;
    uint256 public activationTimestamp;

    address[] public beneficiaryAddresses;
    mapping(address => BeneficiaryConfig) public beneficiaries;

    event PlanAuthorized(address indexed owner, uint256 totalBeneficiaries, uint256 timestamp);
    event PlanUpdated(address indexed owner, address indexed beneficiary, uint256 basisPoints, PayoutType payoutType);
    event InheritanceActivated(address indexed caller, uint256 timestamp, string reason);
    event DistributionExecuted(address indexed beneficiary, uint256 amount, PayoutType payoutType, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only vault owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(status == VaultStatus.Authorized || status == VaultStatus.Activated, "Vault is not in authorized state");
        _;
    }

    constructor() payable {
        owner = msg.sender;
        status = VaultStatus.Draft;
        totalVaultBalance = msg.value;
    }

    receive() external payable {
        totalVaultBalance += msg.value;
    }

    /**
     * @notice Authorizes the complete inheritance distribution plan.
     */
    function authorizePlan(
        address[] calldata _beneficiaries,
        uint256[] calldata _allocationsBps,
        PayoutType[] calldata _payoutTypes
    ) external onlyOwner {
        require(_beneficiaries.length == _allocationsBps.length, "Mismatched beneficiary arrays");
        require(_beneficiaries.length == _payoutTypes.length, "Mismatched payout types array");

        uint256 totalBps = 0;
        delete beneficiaryAddresses;

        for (uint256 i = 0; i < _beneficiaries.length; i++) {
            require(_beneficiaries[i] != address(0), "Invalid beneficiary address");
            totalBps += _allocationsBps[i];

            beneficiaries[_beneficiaries[i]] = BeneficiaryConfig({
                wallet: _beneficiaries[i],
                allocationBasisPoints: _allocationsBps[i],
                payoutType: _payoutTypes[i],
                releasedAmount: 0,
                exists: true
            });

            beneficiaryAddresses.push(_beneficiaries[i]);
            emit PlanUpdated(owner, _beneficiaries[i], _allocationsBps[i], _payoutTypes[i]);
        }

        require(totalBps == 10000, "Allocations must equal exactly 100%");
        status = VaultStatus.Authorized;
        emit PlanAuthorized(owner, _beneficiaries.length, block.timestamp);
    }

    /**
     * @notice Demo Activation: Simulated inheritance event trigger.
     */
    function activateInheritanceDemo() external {
        require(status == VaultStatus.Authorized, "Vault must be authorized before activation");
        status = VaultStatus.Activated;
        activationTimestamp = block.timestamp;
        emit InheritanceActivated(msg.sender, block.timestamp, "Simulated Demo Activation Event");
    }

    /**
     * @notice Executes distribution to all authorized beneficiaries according to their rules.
     */
    function executeDistribution() external {
        require(status == VaultStatus.Activated, "Vault is not activated");

        for (uint256 i = 0; i < beneficiaryAddresses.length; i++) {
            address bAddress = beneficiaryAddresses[i];
            BeneficiaryConfig storage bConfig = beneficiaries[bAddress];

            uint256 amountToDisburse = (address(this).balance * bConfig.allocationBasisPoints) / 10000;

            if (bConfig.payoutType == PayoutType.GradualRelease) {
                // Initial 25% tranche for gradual release in demo
                uint256 trancheAmount = amountToDisburse / 4;
                bConfig.releasedAmount += trancheAmount;
                if (trancheAmount > 0 && address(this).balance >= trancheAmount) {
                    (bool sent, ) = payable(bAddress).call{value: trancheAmount}("");
                    require(sent, "Failed to send Ether");
                }
                emit DistributionExecuted(bAddress, trancheAmount, PayoutType.GradualRelease, block.timestamp);
            } else {
                bConfig.releasedAmount += amountToDisburse;
                if (amountToDisburse > 0 && address(this).balance >= amountToDisburse) {
                    (bool sent, ) = payable(bAddress).call{value: amountToDisburse}("");
                    require(sent, "Failed to send Ether");
                }
                emit DistributionExecuted(bAddress, amountToDisburse, PayoutType.LumpSum, block.timestamp);
            }
        }

        status = VaultStatus.Distributed;
    }

    function getBeneficiariesCount() external view returns (uint256) {
        return beneficiaryAddresses.length;
    }
}
