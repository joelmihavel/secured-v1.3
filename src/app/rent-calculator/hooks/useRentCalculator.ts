"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AREA_DEFAULTS,
  DEPOSIT_MONTHS_TRAD,
  DURATION,
  ESSENTIALS,
  FLENT_DEPOSIT_MULT,
  FLENT_EXIT_FEE,
  FURN_BUY,
  FURN_DEPRECIATION,
  FURN_RENT_MO,
  OPP_RATE,
  SPEND_IDEAS,
  TRAD_1BHK_FACTOR,
  TRAD_MAINT_FACTOR,
  TRAD_PAINTING,
  TRAD_ROOM_FACTOR,
  VACANCY_DAILY,
  VACANCY_DAYS,
} from "../constants";
import type { ComparisonMode, FurnitureMode } from "../types";

export const useRentCalculator = () => {
  const [area, setArea] = useState("HSR Layout");
  const [mode, setMode] = useState<ComparisonMode>("roommate");
  const [furnitureMode, setFurnitureMode] = useState<FurnitureMode>("rent");
  const [flentRent, setFlentRent] = useState(AREA_DEFAULTS["HSR Layout"]);
  const [tradRent, setTradRent] = useState<number | null>(null);
  const [tradMaint, setTradMaint] = useState<number | null>(null);
  const [tradDeposit, setTradDeposit] = useState<number | null>(null);
  const [tradBrokerage, setTradBrokerage] = useState<number | null>(null);
  const [tradPainting, setTradPainting] = useState(TRAD_PAINTING);

  const derivedTradRent = Math.round(
    mode === "1bhk" ? flentRent * TRAD_1BHK_FACTOR : flentRent * TRAD_ROOM_FACTOR
  );
  const derivedMaint = Math.round(derivedTradRent * TRAD_MAINT_FACTOR);
  const derivedDeposit = derivedTradRent * DEPOSIT_MONTHS_TRAD;
  const derivedBrokerage = derivedTradRent;

  const effTradRent = tradRent ?? derivedTradRent;
  const effMaint = tradMaint ?? derivedMaint;
  const effDeposit = tradDeposit ?? derivedDeposit;
  const effBrokerage = tradBrokerage ?? derivedBrokerage;

  useEffect(() => {
    setFlentRent(AREA_DEFAULTS[area]);
    setTradRent(null);
    setTradMaint(null);
    setTradDeposit(null);
    setTradBrokerage(null);
    setTradPainting(TRAD_PAINTING);
  }, [area, mode]);

  const calculations = useMemo(() => {
    const flentDeposit = flentRent * FLENT_DEPOSIT_MULT;
    const flentRentTotal = flentRent * DURATION;
    const flentDepositOpp = Math.round((flentDeposit * OPP_RATE * DURATION) / 12);
    const flentTotal = flentRentTotal + FLENT_EXIT_FEE + flentDepositOpp;
    const flentUpfront = flentDeposit + flentRent;

    const tradFurnBuyCost = Math.round(FURN_BUY * FURN_DEPRECIATION);
    const tradFurnBuyMo = Math.round(tradFurnBuyCost / DURATION);
    const tradFurniture =
      furnitureMode === "rent"
        ? FURN_RENT_MO * DURATION + ESSENTIALS
        : tradFurnBuyCost + ESSENTIALS;
    const tradFurnMo = furnitureMode === "rent" ? FURN_RENT_MO : 0;
    const tradMonthly = effTradRent + effMaint + tradFurnMo;
    const tradRentMaintTotal = (effTradRent + effMaint) * DURATION;
    const tradDepositOpp = Math.round((effDeposit * OPP_RATE * DURATION) / 12);
    const tradVacancy = mode === "roommate" ? VACANCY_DAYS * VACANCY_DAILY : 0;
    const tradTotal =
      tradRentMaintTotal +
      effBrokerage +
      tradPainting +
      tradFurniture +
      tradDepositOpp +
      tradVacancy;
    const tradUpfront =
      effDeposit +
      effBrokerage +
      (furnitureMode === "buy" ? FURN_BUY + ESSENTIALS : ESSENTIALS) +
      tradMonthly;

    const savings = tradTotal - flentTotal;
    const flentWins = savings > 0;
    const isRentLow = effTradRent < derivedTradRent;
    const affordItems = SPEND_IDEAS.filter((item) => item.cost <= Math.abs(savings)).slice(0, 3);

    return {
      flentDeposit,
      flentDepositOpp,
      flentTotal,
      flentUpfront,
      tradFurnBuyCost,
      tradFurnBuyMo,
      tradFurniture,
      tradMonthly,
      tradDepositOpp,
      tradVacancy,
      tradTotal,
      tradUpfront,
      savings,
      flentWins,
      isRentLow,
      affordItems,
    };
  }, [effBrokerage, effDeposit, effMaint, effTradRent, flentRent, furnitureMode, mode, tradPainting]);

  const resetTradInputsFromFlent = (value: number) => {
    setFlentRent(value);
    setTradRent(null);
    setTradMaint(null);
    setTradDeposit(null);
    setTradBrokerage(null);
  };

  return {
    area,
    setArea,
    mode,
    setMode,
    furnitureMode,
    setFurnitureMode,
    flentRent,
    setFlentRent: resetTradInputsFromFlent,
    tradPainting,
    setTradPainting,
    effTradRent,
    setTradRent,
    effMaint,
    setTradMaint,
    effDeposit,
    setTradDeposit,
    effBrokerage,
    setTradBrokerage,
    calculations,
  };
};
