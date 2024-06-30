// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Inskribbl {
    struct Game {
        bytes32 wordHash;
        address creator;
        uint256 pot;
        uint256 deadline;
        address winner;
    }

    Game public currentGame;
    mapping(address => uint256) public guesses;
    uint256 public immutable fee;

    constructor(uint256 _fee) {
        fee = _fee;
    }

    modifier onlyGameCreator() {
        require(msg.sender == currentGame.creator, "Only game creator can call this function.");
        _;
    }

    modifier gameActive() {
        require(block.timestamp < currentGame.deadline, "The game has expired.");
        _;
    }

    event GameCreated(address creator, bytes32 wordHash, uint256 pot, uint256 deadline);
    event GuessSubmitted(address player, string guess, uint256 fee);
    event GameWon(address winner, uint256 pot);

    function createGame(bytes32 _wordHash, uint256 _duration) external {
        require(block.timestamp >= currentGame.deadline, "The current game is still active");

        currentGame =
            Game({wordHash: _wordHash, creator: msg.sender, pot: address(this).balance, deadline: block.timestamp + _duration, winner: address(0)});

        emit GameCreated(msg.sender, _wordHash, 0, currentGame.deadline);
    }

    function submitGuess(string calldata _guess) external payable gameActive {
        require(msg.value == fee, "Not enough ETH");

        bytes32 guessHash = keccak256(abi.encodePacked(_guess));
        guesses[msg.sender] = guesses[msg.sender] + msg.value;

        if (guessHash == currentGame.wordHash) {
            uint256 winnings = currentGame.pot + msg.value;
            currentGame.pot = 0;
            currentGame.deadline = block.timestamp;
            currentGame.winner = msg.sender;
            payable(msg.sender).transfer(winnings);
            emit GameWon(msg.sender, winnings);
        } else {
            currentGame.pot += msg.value;
            emit GuessSubmitted(msg.sender, _guess, msg.value);
        }
    }
}
