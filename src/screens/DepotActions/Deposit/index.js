import React, { useContext, useState, useEffect } from 'react';
import Action from './Action';
import Confirmation from './Confirmation';
import Complete from './Complete';

import snxJSConnector from '../../../helpers/snxJSConnector';
import { SliderContext } from '../../../components/Slider';
import { Store } from '../../../store';

const bigNumberFormatter = value =>
  Number(snxJSConnector.utils.formatEther(value));

const useGetDepotData = walletAddress => {
  const [data, setData] = useState({});
  useEffect(() => {
    const getDepotData = async () => {
      try {
        const result = await snxJSConnector.snxJS.Depot.totalSellableDeposits();
        setData({
          totalSellableDeposits: bigNumberFormatter(result),
        });
      } catch (e) {
        console.log(e);
      }
    };
    getDepotData();
  }, [walletAddress]);
  return data;
};

const Deposit = ({ onDestroy }) => {
  const { handleNext, handlePrev } = useContext(SliderContext);
  // const [depositSynths, setDepositAmount] = useState(null);
  const [transactionInfo, setTransactionInfo] = useState({});
  const {
    state: {
      wallet: { currentWallet, walletType, networkName },
    },
  } = useContext(Store);

  const { totalSellableDeposits } = useGetDepotData(currentWallet);
  console.log(totalSellableDeposits);
  const onDeposit = async amount => {
    try {
      console.log(amount);
    } catch (e) {
      setTransactionInfo({ ...transactionInfo, transactionError: e });
      handleNext(2);
      console.log(e);
    }
  };

  const props = {
    onDestroy,
    onDeposit,
    goBack: handlePrev,
    totalSellableDeposits,
    ...transactionInfo,
    // depositSynths,
    walletType,
    networkName,
  };

  return [Action, Confirmation, Complete].map((SlideContent, i) => (
    <SlideContent key={i} {...props} />
  ));
};

export default Deposit;