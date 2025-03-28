// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ClaimProcessor
 * @dev Handles insurance claim processing and verification
 */
contract ClaimProcessor {
    enum ClaimStatus { Pending, Approved, Rejected, Disputed }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address claimant;
        uint256 amount;
        string reason;
        uint256 fileDate;
        ClaimStatus status;
        string evidence;
        address approver;
    }

    mapping(uint256 => Claim) public claims;
    uint256 public nextClaimId;

    event ClaimFiled(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant);
    event ClaimApproved(uint256 indexed claimId, address approver);
    event ClaimRejected(uint256 indexed claimId, address approver, string reason);
    event ClaimPaid(uint256 indexed claimId, address indexed claimant, uint256 amount);

    modifier onlyPending(uint256 claimId) {
        require(claims[claimId].status == ClaimStatus.Pending, "Claim is not pending");
        _;
    }

    function fileClaim(
        uint256 policyId,
        uint256 amount,
        string memory reason,
        string memory evidence
    ) external returns (uint256) {
        uint256 claimId = nextClaimId++;

        claims[claimId] = Claim({
            id: claimId,
            policyId: policyId,
            claimant: msg.sender,
            amount: amount,
            reason: reason,
            fileDate: block.timestamp,
            status: ClaimStatus.Pending,
            evidence: evidence,
            approver: address(0)
        });

        emit ClaimFiled(claimId, policyId, msg.sender);
        return claimId;
    }

    function approveClaim(uint256 claimId) external onlyPending(claimId) {
        Claim storage claim = claims[claimId];
        claim.status = ClaimStatus.Approved;
        claim.approver = msg.sender;

        emit ClaimApproved(claimId, msg.sender);
    }

    function rejectClaim(uint256 claimId, string memory reason) external onlyPending(claimId) {
        Claim storage claim = claims[claimId];
        claim.status = ClaimStatus.Rejected;
        claim.approver = msg.sender;

        emit ClaimRejected(claimId, msg.sender, reason);
    }

    function payClaim(uint256 claimId) external payable {
        Claim storage claim = claims[claimId];
        require(claim.status == ClaimStatus.Approved, "Claim not approved");
        require(msg.value == claim.amount, "Incorrect payment amount");

        (bool sent, ) = claim.claimant.call{value: msg.value}("");
        require(sent, "Failed to send claim payment");

        emit ClaimPaid(claimId, claim.claimant, msg.value);
    }

    function getClaimDetails(uint256 claimId) external view returns (
        uint256 policyId,
        address claimant,
        uint256 amount,
        string memory reason,
        uint256 fileDate,
        ClaimStatus status,
        string memory evidence,
        address approver
    ) {
        Claim memory claim = claims[claimId];
        return (
            claim.policyId,
            claim.claimant,
            claim.amount,
            claim.reason,
            claim.fileDate,
            claim.status,
            claim.evidence,
            claim.approver
        );
    }
}