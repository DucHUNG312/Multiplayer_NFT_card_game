import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PageHOC, CustomButton, CustomInput, GameLoad } from "../components";
import styles from "../styles";
import { useGlobalContext } from "../context";

const CreateBattle = () => {
  const {
    contract,
    walletAddress,
    setShowAlert,
    battleName,
    setBattleName,
    gameData,
    setErrorMessage,
  } = useGlobalContext();
  const [waitBatle, setWaitBattle] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const checkForPlayer = async () => {
      const playerExists = await contract.isPlayer(walletAddress);

      if (!playerExists) navigate("/");
    };

    if (contract) checkForPlayer();
  }, [contract]);

  useEffect(() => {
    if (gameData?.activeBattle?.battleStatus === 1) {
      navigate(`/battle/${gameData.activeBattle.name}`);
    } else if (gameData?.activeBattle?.battleStatus === 0) {
      setWaitBattle(true);
    }
  }, [gameData]);

  const handleClick = async () => {
    if (!battleName || !battleName.trim()) return null;

    try {
      await contract.createBattle(battleName);
      setWaitBattle(true);
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <>
      {waitBatle && <GameLoad />}
      <div className="flex flex-col mb-5">
        <CustomInput
          label="Battle"
          placeholder="Enter battle name"
          value={battleName}
          handleValueChange={setBattleName}
        />
        <CustomButton
          title="Create Battle"
          handleClick={handleClick}
          restStyles="mt-6"
        />
      </div>

      <p className={styles.infoText} onClick={() => navigate("/join-battle")}>
        Or join already existing battles
      </p>
    </>
  );
};

export default PageHOC(
  CreateBattle,
  <>
    Create <br /> a new Battle
  </>,
  <>Create your battle and wait for a friend to join!</>
);
