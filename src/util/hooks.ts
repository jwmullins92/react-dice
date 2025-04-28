import { useContext, useEffect } from "react";

import { DiceContext } from "../context/DiceContext";
import { Face } from "../types/types";

export const useDie = (id: string) => {
  const context = useContext(DiceContext);
  return context.getDie(id);
};

export const useDiceGroup = (groupId: string) => {
  const context = useContext(DiceContext);
  return context.getGroup(groupId);
};

export const useKeyboardRoller = (
  keyboardListeners: string[],
  roll?: () => Promise<Face | void>,
) => {
  useEffect(() => {
    if (!roll) return;
    const keyPressHandler = async ({ key }: KeyboardEvent) => {
      if (keyboardListeners.includes(key)) {
        return roll();
      }
    };
    if (!keyboardListeners?.length) return;
    addEventListener(`keypress`, keyPressHandler);
    return () => removeEventListener(`keypress`, keyPressHandler);
  }, [keyboardListeners, roll]);
};
