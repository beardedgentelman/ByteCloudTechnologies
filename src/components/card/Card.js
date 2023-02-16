import { useCallback, useEffect, useState } from "react";
import { BarColumn, Form, ProviderInfo } from "../../components";
import backblazeIcon from "../../assets/icons/logo-backblaze-flame-header.png";
import bunnyIcon from "../../assets/icons/bunny-icon.png";
import scalewayIcon from "../../assets/icons/scaleway-icon.png";
import vultrIcon from "../../assets/icons/vultr-icon.png";
import style from "./card.module.css";

const BACKBLAZE_MINIMUM_PAYMENT = 7;
const BACKBLAZE_STORAGE_PRICE = 0.005;
const BACKBLAZE_TRANSFER_PRICE = 0.01;

const BUNNY_MAX_PAYMENT = 10;
const BUNNY_HDD_PRICE = 0.01;
const BUNNY_SSD_PRICE = 0.02;
const BUNNY_TRANSFER_PRICE = 0.01;

const SCALEWAY_FREE_STORAGE = 75;
const SCALEWAY_SINGLE_PRICE = 0.03;
const SCALEWAY_MULTY_PRICE = 0.06;
const SCALEWAY_TRANSFER_PRICE = 0.02;

const VULTR_MINIMUM_PAYMENT = 5;
const VULTR_PRICE = 0.01;

const Card = () => {
  const [storage, setStorage] = useState(0);
  const [transfer, setTransfer] = useState(0);
  const [drive, setDrive] = useState("hdd");
  const [type, setType] = useState("single");
  const [lowestProvider, setLowestProvider] = useState("");

  const backblazeStorageCost = (storage) => {
    return storage * BACKBLAZE_STORAGE_PRICE;
  };

  const backblazeTransferCost = (transfer) => {
    return transfer * BACKBLAZE_TRANSFER_PRICE;
  };

  const getBackblazeTotalCost = useCallback(() => {
    return Math.max(BACKBLAZE_MINIMUM_PAYMENT, backblazeStorageCost(storage) + backblazeTransferCost(transfer));
  }, [storage, transfer]);

  const bunnyStorageCost = useCallback(() => {
    const price = drive === "hdd" ? BUNNY_HDD_PRICE : BUNNY_SSD_PRICE;
    const maxStorageFor10Dollars = 1000 / price;
    const actualStorage = Math.min(maxStorageFor10Dollars, storage);
    const cost = actualStorage * price;
    return Math.min(BUNNY_MAX_PAYMENT, cost);
  }, [drive, storage]);

  const bunnyTransferCost = useCallback(() => {
    return transfer * BUNNY_TRANSFER_PRICE;
  }, [transfer]);

  const getBunnyTotalCost = useCallback(() => {
    const bunnyCost = bunnyStorageCost() + bunnyTransferCost();
    return Math.min(10, bunnyCost);
  }, [bunnyStorageCost, bunnyTransferCost]);

  const scalewayStorageCost = useCallback(
    (storage) => {
      const storagePrice = type === "single" ? SCALEWAY_SINGLE_PRICE : SCALEWAY_MULTY_PRICE;
      const billableStorage = Math.max(storage - SCALEWAY_FREE_STORAGE, 0);
      return billableStorage * storagePrice;
    },
    [type]
  );

  const scalewayTransferCost = (transfer) => {
    const billableTransfer = Math.max(transfer - SCALEWAY_FREE_STORAGE, 0);
    return billableTransfer * SCALEWAY_TRANSFER_PRICE;
  };

  const getScalewayTotalCost = useCallback(() => {
    return scalewayStorageCost(storage) + scalewayTransferCost(transfer);
  }, [scalewayStorageCost, storage, transfer]);

  const vultrStorageCost = (storage) => {
    return storage * VULTR_PRICE;
  };

  const vultrTransferCost = (transfer) => {
    return transfer * VULTR_PRICE;
  };

  const getVultrTotalCost = useCallback(() => {
    return Math.max(VULTR_MINIMUM_PAYMENT, vultrStorageCost(storage) + vultrTransferCost(transfer));
  }, [storage, transfer]);

  const totalCost = getBackblazeTotalCost() + getBunnyTotalCost() + getScalewayTotalCost() + getVultrTotalCost();

  const getLowestCost = useCallback(() => {
    const backblazeCost = getBackblazeTotalCost();
    const bunnyCost = getBunnyTotalCost();
    const scalewayCost = getScalewayTotalCost();
    const vultrCost = getVultrTotalCost();

    const lowestCost = Math.min(backblazeCost, bunnyCost, scalewayCost, vultrCost);
    if (lowestCost === backblazeCost) {
      setLowestProvider("backblaze");
    } else if (lowestCost === bunnyCost) {
      setLowestProvider("bunny");
    } else if (lowestCost === scalewayCost) {
      setLowestProvider("scaleway");
    } else if (lowestCost === vultrCost) {
      setLowestProvider("vultr");
    }
  }, [getBackblazeTotalCost, getBunnyTotalCost, getScalewayTotalCost, getVultrTotalCost]);

  useEffect(() => {
    getLowestCost();
  }, [storage, transfer, drive, type, getLowestCost]);

  return (
    <section className={style.card}>
      <div className={style.scales}>
        <div className={style.providers_info}>
          <ProviderInfo name='backblaze' provIcon={backblazeIcon} />
          <ProviderInfo name='bunny' provIcon={bunnyIcon}>
            <div className={style.various}>
              <label htmlFor='hdd'>
                HDD
                <input type='radio' name='drive' id='hdd' value='hdd' checked={drive === "hdd"} onChange={() => setDrive("hdd")} />
              </label>
              <label htmlFor='ssd'>
                SSD
                <input type='radio' name='drive' id='ssd' value='sdd' checked={drive === "ssd"} onChange={() => setDrive("ssd")} />
              </label>
            </div>
          </ProviderInfo>
          <ProviderInfo name='scaleway' provIcon={scalewayIcon}>
            <div className={style.various}>
              <label htmlFor='single'>
                Single
                <input type='radio' name='type' id='single' value='single' checked={type === "single"} onChange={() => setType("single")} />
              </label>
              <label htmlFor='multy'>
                Multy
                <input type='radio' name='type' id='multy' value='multy' checked={type === "multi"} onChange={() => setType("multi")} />
              </label>
            </div>
          </ProviderInfo>
          <ProviderInfo name='vultr' provIcon={vultrIcon} />
        </div>
        <div className={style.bars}>
          <BarColumn name='backblaze' result={getBackblazeTotalCost().toFixed(2)} width={totalCost === 0 ? 0 : (getBackblazeTotalCost() / totalCost) * 100} background={lowestProvider === "backblaze" ? "	#F00000" : "#7d7d7d"} />
          <BarColumn name='bunny' result={getBunnyTotalCost().toFixed(2)} width={totalCost === 0 ? 0 : (getBunnyTotalCost() / totalCost) * 100} background={lowestProvider === "bunny" ? "	#FA5000" : "#7d7d7d"} />
          <BarColumn name='scaleway' result={getScalewayTotalCost().toFixed(2)} width={totalCost === 0 ? 0 : (getScalewayTotalCost() / totalCost) * 100} background={lowestProvider === "scaleway" ? "	#660099" : "#7d7d7d"} />
          <BarColumn name='vultr' result={getVultrTotalCost().toFixed(2)} width={totalCost === 0 ? 0 : (getVultrTotalCost() / totalCost) * 100} background={lowestProvider === "vultr" ? "	#00bcff" : "#7d7d7d"} />
        </div>
      </div>
      <Form formName='price_calc' storage={storage} transfer={transfer} onChangeStorage={(e) => setStorage(e.target.value)} onChangeTransfer={(e) => setTransfer(e.target.value)} />
    </section>
  );
};

export default Card;
