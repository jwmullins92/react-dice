import { ComponentProps, createContext, ReactElement } from "react";

import { Die } from "../components/Die";
import { Face } from "../types/types";

export type RollGroupResult = {
  values: Face[];
  sum: number;
  groupings: Partial<Record<Face, number>>;
};
export type DieHandle = { roll: () => Promise<Face>; toggleFreeze: () => void };
export type DieController = { id: string } & DieHandle;
export type DiceGroup = DiceGroupsContextType[`groupRollers`][string];
export type DieProps = ComponentProps<typeof Die>;

export type DiceGroupsContextType = {
  groupRollers: Record<string, { roll: () => void }>;
  addGroup: (
    groupId: string,
    dice: ReactElement<DieProps>[],
  ) => {
    roll: () => Promise<RollGroupResult>;
    diceElements: ReactElement<DieProps>[];
  };
  getGroup: (groupId: string) => DiceGroup | undefined;
  registerDie: (die: DieController) => void;
  unregisterDie: (unregisterId: string) => void;
  getDie: (id: string) => DieController | undefined;
};
export const DiceContext = createContext<DiceGroupsContextType>({
  groupRollers: {},
  addGroup: () => ({
    diceElements: [],
    roll: async () => ({ values: [], sum: 0, groupings: {} }),
  }),
  getGroup: () => undefined,
  registerDie: () => {},
  unregisterDie: () => {},
  getDie: () => undefined,
});
