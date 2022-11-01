// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IAvaxGods {
    /// @notice Game status, it can be started, ended or pending
    enum BattleStatus {
        PENDING,
        STARTED,
        ENDED
    }

    /**
     * @dev GameToken struct to store player token info
     * @param name battle card name, set by player
     * @param id battle card token id, random generated
     * @param attackStrength battle card attack, random generated
     * @param defenseStrength battle card defense, random generated
     */
    struct GameToken {
        string name;
        uint256 id;
        uint256 attackStrength;
        uint256 defenseStrength;
    }

    /**
     * @dev Player struct to store player info
     * @param playerAddress player wallet address
     * @param playerName player name, set by player during registration
     * @param playerMana player mana, affected by battle results
     * @param playerHealth player health, affected by battle results
     * @param inBattle indicate if a player is in battle
     */
    struct Player {
        address playerAddress;
        string playerName;
        uint256 playerMana;
        uint256 playerHealth;
        bool inBattle;
    }

    /**
     * @dev Battle struct to store battle info
     * @param battleStatus enum to indicate battle status
     * @param battleHash a hash of the battle name
     * @param name batle name, set by player who creates battle
     * @param players players address array representing players in this battle
     * @param moves unit array representing players's move
     * @param winner winner address
     */
    struct Battle {
        BattleStatus battleStatus;
        bytes32 battleHash;
        string name;
        address[2] players;
        uint8[2] moves;
        address winner;
    }

    /**
     * @dev Player information struct after moved in battle
     * @param index index of player in players array
     * @param move record move of the player
     * @param health player health remains after moves
     * @param attack attack of the player's game token card
     * @param defense defense of the player's game token card
     */
    struct PlayerPoints {
        uint256 index;
        uint256 move;
        uint256 health;
        uint256 attack;
        uint256 defense;
    }

    /// @dev Emitted when a new player registed
    event NewPlayer(address indexed owner, string name);

    /// @dev Emitted when a new battle started
    event NewBattle(
        string battleName,
        address indexed player1,
        address indexed player2
    );

    /// @dev Emitted when a battle ended
    event BattleEnded(
        string battleName,
        address indexed winner,
        address indexed loser
    );

    /// @dev Emitted when a player moves in the battle
    event BattleMove(string indexed battleName, bool indexed isFirstMove);

    /// @dev Emitted when a new game token is minted
    event NewGameToken(
        address indexed owner,
        uint256 id,
        uint256 attackStrength,
        uint256 defenseStrength
    );

    /// @dev Emitted when a round finished
    event RoundEnded(address[2] damagedPlayers);
}
