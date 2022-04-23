// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] private campaigns;

    function createCampaign(uint _minimum) public {
        Campaign newCampaign = new Campaign(_minimum, msg.sender);
        campaigns.push(address(newCampaign));
    }

    function getCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}

contract Campaign {
    address public manager;
    struct Request {
        string description;
        address recipient;
        uint value;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }   

    uint public requestCount;
    mapping(uint => Request) public requests;

    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;

    modifier onlyManager {
        require(msg.sender == manager, "Only manager of this campaign can call this function");
        _;
    }

    constructor(uint _minimum, address _manager) {
        manager = _manager;
        minimumContribution = _minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Value is less than minimum contribution");
        
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory _description, 
        uint _value, 
        address _recipient
    ) public onlyManager {
        uint id = requestCount++;

        Request storage newRequest = requests[id];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }

    function approveRequest(uint _index) public {
        require(approvers[msg.sender], "You are not part of this campaign, please contribute first");
        Request storage req = requests[_index];
        require(!req.approvals[msg.sender], "You are already approve this request");

        req.approvals[msg.sender] = true;
        req.approvalCount++;
    }

    function finalizeRequest(uint _index) public onlyManager {
        Request storage req = requests[_index];
        require(!req.complete, "This request is already completed");
        require(req.approvalCount > (approversCount / 2), "Approval count is less than half of the contributor");

        payable(req.recipient).transfer(req.value);
        req.complete = true;
    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requestCount,
            approversCount,
            manager
        );
    }
}