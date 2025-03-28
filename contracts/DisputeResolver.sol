// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title DisputeResolver
 * @dev Manages dispute resolution for insurance claims
 */
contract DisputeResolver {
    enum DisputeStatus { Active, Resolved, Escalated }
    enum Resolution { Pending, InFavorOfClaimant, InFavorOfInsurer }

    struct Dispute {
        uint256 id;
        uint256 claimId;
        address claimant;
        address insurer;
        string reason;
        uint256 fileDate;
        DisputeStatus status;
        Resolution resolution;
        string evidence;
        address arbitrator;
        string arbitratorNotes;
    }

    mapping(uint256 => Dispute) public disputes;
    uint256 public nextDisputeId;
    mapping(address => bool) public authorizedArbitrators;

    event DisputeFiled(uint256 indexed disputeId, uint256 indexed claimId, address indexed claimant);
    event DisputeResolved(uint256 indexed disputeId, Resolution resolution);
    event DisputeEscalated(uint256 indexed disputeId, string reason);
    event ArbitratorAssigned(uint256 indexed disputeId, address arbitrator);

    modifier onlyArbitrator() {
        require(authorizedArbitrators[msg.sender], "Only authorized arbitrators can call this function");
        _;
    }

    modifier onlyActiveDispute(uint256 disputeId) {
        require(disputes[disputeId].status == DisputeStatus.Active, "Dispute is not active");
        _;
    }

    function fileDispute(
        uint256 claimId,
        address insurer,
        string memory reason,
        string memory evidence
    ) external returns (uint256) {
        uint256 disputeId = nextDisputeId++;

        disputes[disputeId] = Dispute({
            id: disputeId,
            claimId: claimId,
            claimant: msg.sender,
            insurer: insurer,
            reason: reason,
            fileDate: block.timestamp,
            status: DisputeStatus.Active,
            resolution: Resolution.Pending,
            evidence: evidence,
            arbitrator: address(0),
            arbitratorNotes: ""
        });

        emit DisputeFiled(disputeId, claimId, msg.sender);
        return disputeId;
    }

    function assignArbitrator(uint256 disputeId, address arbitrator) external onlyActiveDispute(disputeId) {
        require(authorizedArbitrators[arbitrator], "Invalid arbitrator address");
        disputes[disputeId].arbitrator = arbitrator;
        emit ArbitratorAssigned(disputeId, arbitrator);
    }

    function resolveDispute(
        uint256 disputeId,
        Resolution resolution,
        string memory notes
    ) external onlyArbitrator onlyActiveDispute(disputeId) {
        Dispute storage dispute = disputes[disputeId];
        require(msg.sender == dispute.arbitrator, "Only assigned arbitrator can resolve");

        dispute.status = DisputeStatus.Resolved;
        dispute.resolution = resolution;
        dispute.arbitratorNotes = notes;

        emit DisputeResolved(disputeId, resolution);
    }

    function escalateDispute(uint256 disputeId, string memory reason) external onlyActiveDispute(disputeId) {
        Dispute storage dispute = disputes[disputeId];
        require(msg.sender == dispute.claimant || msg.sender == dispute.insurer, "Unauthorized");

        dispute.status = DisputeStatus.Escalated;
        emit DisputeEscalated(disputeId, reason);
    }

    function getDisputeDetails(uint256 disputeId) external view returns (
        uint256 claimId,
        address claimant,
        address insurer,
        string memory reason,
        uint256 fileDate,
        DisputeStatus status,
        Resolution resolution,
        string memory evidence,
        address arbitrator,
        string memory arbitratorNotes
    ) {
        Dispute memory dispute = disputes[disputeId];
        return (
            dispute.claimId,
            dispute.claimant,
            dispute.insurer,
            dispute.reason,
            dispute.fileDate,
            dispute.status,
            dispute.resolution,
            dispute.evidence,
            dispute.arbitrator,
            dispute.arbitratorNotes
        );
    }
}