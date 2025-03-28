// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PolicyManager
 * @dev Manages insurance policies and premium payments
 */
contract PolicyManager {
    struct Policy {
        uint256 id;
        address insurer;
        address customer;
        uint256 premium;
        uint256 coverage;
        uint256 startDate;
        uint256 endDate;
        bool active;
        uint256 lastPremiumPayment;
    }

    mapping(uint256 => Policy) public policies;
    uint256 public nextPolicyId;

    event PolicyCreated(uint256 indexed policyId, address indexed customer, uint256 premium);
    event PremiumPaid(uint256 indexed policyId, address indexed customer, uint256 amount);
    event PolicyRenewed(uint256 indexed policyId, uint256 newEndDate);
    event PolicyCancelled(uint256 indexed policyId);

    modifier onlyActivePolicy(uint256 policyId) {
        require(policies[policyId].active, "Policy is not active");
        _;
    }

    function createPolicy(
        address customer,
        uint256 premium,
        uint256 coverage,
        uint256 duration
    ) external returns (uint256) {
        uint256 policyId = nextPolicyId++;
        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + duration;

        policies[policyId] = Policy({
            id: policyId,
            insurer: msg.sender,
            customer: customer,
            premium: premium,
            coverage: coverage,
            startDate: startDate,
            endDate: endDate,
            active: true,
            lastPremiumPayment: startDate
        });

        emit PolicyCreated(policyId, customer, premium);
        return policyId;
    }

    function payPremium(uint256 policyId) external payable onlyActivePolicy(policyId) {
        Policy storage policy = policies[policyId];
        require(msg.sender == policy.customer, "Only policy holder can pay premium");
        require(msg.value == policy.premium, "Incorrect premium amount");

        policy.lastPremiumPayment = block.timestamp;
        emit PremiumPaid(policyId, msg.sender, msg.value);

        // Transfer premium to insurer
        (bool sent, ) = policy.insurer.call{value: msg.value}("");
        require(sent, "Failed to send premium to insurer");
    }

    function renewPolicy(uint256 policyId, uint256 newDuration) external onlyActivePolicy(policyId) {
        Policy storage policy = policies[policyId];
        require(msg.sender == policy.customer, "Only policy holder can renew");
        require(block.timestamp <= policy.endDate, "Policy has expired");

        policy.endDate = block.timestamp + newDuration;
        emit PolicyRenewed(policyId, policy.endDate);
    }

    function cancelPolicy(uint256 policyId) external {
        Policy storage policy = policies[policyId];
        require(msg.sender == policy.insurer || msg.sender == policy.customer, "Unauthorized");
        require(policy.active, "Policy already inactive");

        policy.active = false;
        emit PolicyCancelled(policyId);
    }

    function getPolicyDetails(uint256 policyId) external view returns (
        address insurer,
        address customer,
        uint256 premium,
        uint256 coverage,
        uint256 startDate,
        uint256 endDate,
        bool active,
        uint256 lastPremiumPayment
    ) {
        Policy memory policy = policies[policyId];
        return (
            policy.insurer,
            policy.customer,
            policy.premium,
            policy.coverage,
            policy.startDate,
            policy.endDate,
            policy.active,
            policy.lastPremiumPayment
        );
    }
}