// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./PolicyManager.sol";
import "./ClaimProcessor.sol";
import "./DisputeResolver.sol";

/**
 * @title BankAssurance
 * @dev Main contract that orchestrates the bank assurance system
 */
contract BankAssurance {
    address public owner;
    PolicyManager public policyManager;
    ClaimProcessor public claimProcessor;
    DisputeResolver public disputeResolver;

    event InsuranceCompanyAdded(address company, string name);
    event BankAdded(address bank, string name);

    mapping(address => bool) public authorizedInsuranceCompanies;
    mapping(address => bool) public authorizedBanks;
    mapping(address => string) public companyNames;
    mapping(address => string) public bankNames;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthorizedInsurer() {
        require(authorizedInsuranceCompanies[msg.sender], "Only authorized insurance companies can call this function");
        _;
    }

    modifier onlyAuthorizedBank() {
        require(authorizedBanks[msg.sender], "Only authorized banks can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
        policyManager = new PolicyManager();
        claimProcessor = new ClaimProcessor();
        disputeResolver = new DisputeResolver();
    }

    function addInsuranceCompany(address company, string memory name) external onlyOwner {
        require(!authorizedInsuranceCompanies[company], "Company already authorized");
        authorizedInsuranceCompanies[company] = true;
        companyNames[company] = name;
        emit InsuranceCompanyAdded(company, name);
    }

    function addBank(address bank, string memory name) external onlyOwner {
        require(!authorizedBanks[bank], "Bank already authorized");
        authorizedBanks[bank] = true;
        bankNames[bank] = name;
        emit BankAdded(bank, name);
    }

    function isInsuranceCompany(address company) external view returns (bool) {
        return authorizedInsuranceCompanies[company];
    }

    function isBank(address bank) external view returns (bool) {
        return authorizedBanks[bank];
    }
}