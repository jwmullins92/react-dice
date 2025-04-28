import {
  cloneElement,
  createRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useState,
} from "react";

import { DiceContext } from "./DiceContext";
import {
  DiceGroupsContextType,
  DieController,
  DieHandle,
  DieProps,
} from "./DiceContext";

export const DiceProvider = ({ children }: { children: ReactNode }) => {
  const [registeredDice, setRegisteredDice] = useState<DieController[]>([]);
  const [groups, setGroups] = useState<DiceGroupsContextType[`groupRollers`]>(
    {},
  );

  const registerDie = (die: DieController) => {
    setRegisteredDice((prev) => [...prev, die]);
  };

  const unregisterDie = (unregisterId: string) => {
    setRegisteredDice((prev) => prev.filter(({ id }) => id != unregisterId));
  };

  const getGroup = (groupId: string) => groups[groupId];
  const getDie = (id: string) => registeredDice.find((die) => die.id == id);
  const addGroup = (groupId: string, dice: ReactElement<DieProps>[]) => {
    const dieRefs: RefObject<DieHandle | null>[] = [];
    const diceElements = dice.map((die, i) => {
      if (!isValidElement(die)) return null;
      const ref = createRef<DieHandle>();
      dieRefs.push(ref);
      return cloneElement(die, {
        onClick: () => ref.current?.toggleSave(),
        ...die.props,
        key: i,
        ref,
      });
    }) as ReactElement<DieProps>[];

    const rollGroup = async () => {
      const values = await Promise.all(
        dieRefs.map((die) => die.current!.roll()),
      );
      return {
        values,
        sum: values.reduce((total, result) => total + result, 0),
        groupings: Object.fromEntries(
          Object.entries(Object.groupBy(values, (value) => value)).map(
            ([key, count]) => [key, count.length],
          ),
        ),
      };
    };
    setGroups((oldGroups) => ({
      ...oldGroups,
      [groupId]: { rollGroup },
    }));
    return { diceElements, rollGroup };
  };

  return (
    <DiceContext.Provider
      value={{
        groupRollers: groups,
        getGroup,
        addGroup,
        getDie,
        registerDie,
        unregisterDie,
      }}
    >
      {children}
    </DiceContext.Provider>
  );
};
