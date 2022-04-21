// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract Lottery {
    address private manager;
    address payable[] private players;

    constructor() {
        manager = msg.sender;
    }

    function join() public payable {
        require(msg.value >= 0.01 ether, "Join must be cost at least 0.01 ETH");
        // players.push(msg.sender);

        // Refactored based on https://stackoverflow.com/a/66799729
        players.push(payable(msg.sender));
    }

    function random() private view returns(uint) {
        // return uint(keccak256(block.difficulty, now, players));
        
        // Refactored based on https://ethereum.stackexchange.com/a/63128
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public managerOnly {
        // Pseudo random number between the players
        uint index = random() % players.length; 

        // Transfer some amount of wei to players[index]
        players[index].transfer(address(this).balance); 
        
        // Reset the array for another lottery round
        players = new address payable[](0);
    }

    modifier managerOnly {
        require(msg.sender == manager, "Only manager can call this function");
        _; // Run the rest of the function
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
}