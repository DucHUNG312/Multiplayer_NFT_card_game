import { ethers } from "ethers";

import { ABI } from "../contract";
import { playAudio, sparcle } from "../utils/animation";
import { defenseSound } from "../assets";

const AddNewEvent = (eventFilter, provider, cb) => {
  provider.removeListener(eventFilter);

  provider.on(eventFilter, (logs) => {
    const parsedLog = new ethers.utils.Interface(ABI).parseLog(logs);

    cb(parsedLog);
  });
};

//* Get battle card coordinates
const getCoords = (cardRef) => {
  const { left, top, width, height } = cardRef.current.getBoundingClientRect();

  return {
    pageX: left + width / 2,
    pageY: top + height / 2.25,
  };
};

const emptyAccount = "0x0000000000000000000000000000000000000000";

export const createEventListener = ({
  navigate,
  contract,
  provider,
  walletAddress,
  setShowAlert,
  player1Ref,
  player2Ref,
  setUpdateGameData,
}) => {
  // New Player Listener
  const NewPlayerEventFilter = contract.filters.NewPlayer();
  AddNewEvent(NewPlayerEventFilter, provider, ({ args }) => {
    if (walletAddress === args.owner) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player has been successfully registered",
      });
    }
  });

  // New Battle Listener
  const NewBattleEventFilter = contract.filters.NewBattle();
  AddNewEvent(NewBattleEventFilter, provider, ({ args }) => {
    if (
      walletAddress.toLowerCase() === args.player1.toLowerCase() ||
      walletAddress.toLowerCase() === args.player2.toLowerCase()
    ) {
      navigate(`/battle/${args.battleName}`);
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  // New Game Token Listener
  const NewGameTokenEventFilter = contract.filters.NewGameToken();
  AddNewEvent(NewGameTokenEventFilter, provider, ({ args }) => {
    if (walletAddress.toLowerCase() === args.owner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "Player game token has been successfully generated",
      });

      navigate("/create-battle");
    }
  });

  // New Battle Move Listener
  const BattleMoveEventFilter = contract.filters.BattleMove();
  AddNewEvent(BattleMoveEventFilter, provider, ({ args }) => {
    console.log("Battle moved!", args);
  });

  // Round Ended Listener
  const RoundEndedEventFilter = contract.filters.RoundEnded();
  AddNewEvent(RoundEndedEventFilter, provider, ({ args }) => {
    for (let i = 0; i < args.damagedPlayers.length; i += 1) {
      if (args.damagedPlayers[i] !== emptyAccount) {
        if (args.damagedPlayers[i] === walletAddress) {
          sparcle(getCoords(player1Ref));
        } else if (args.damagedPlayers[i] !== walletAddress) {
          sparcle(getCoords(player2Ref));
        }
      } else {
        playAudio(defenseSound);
      }
    }

    setUpdateGameData((prevUpdateGameData) => prevUpdateGameData + 1);
  });

  // Battle Ended Listener
  const NewBattleEndedEventFilter = contract.filters.BattleEnded();
  AddNewEvent(NewBattleEndedEventFilter, provider, ({ args }) => {
    console.log("Battle ended!", args, walletAddress);

    if (walletAddress.toLowerCase() === args.winner.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "success",
        message: "You Won!",
      });
    } else if (walletAddress.toLowerCase() === args.loser.toLowerCase()) {
      setShowAlert({
        status: true,
        type: "failure",
        message: "You Lost!",
      });
    }

    navigate("/create-battle");
  });
};
