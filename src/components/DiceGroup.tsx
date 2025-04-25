import { Property } from "csstype";
import {
  ComponentProps,
  CSSProperties,
  forwardRef,
  ReactElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { DiceContext, RollGroupResult } from "../context/DiceContext";
import { Die } from "./Die";
import { useKeyboardRoller } from "../util/hooks";

type DieProps = ComponentProps<typeof Die>;
export const DiceGroup = forwardRef(
  (
    {
      diceCount,
      diceSize = `50px`,
      containerStyle,
      diceAndRollerContainerStyle,
      groupId,
      children,
      Roller,
      onRollGroup,
      keyboardListeners = [],
    }: {
      diceCount?: number;
      containerStyle?: CSSProperties;
      diceAndRollerContainerStyle?: CSSProperties;
      diceSize?: Property.Width<string | number>;
      groupId: string;
      children?: ReactElement<DieProps> | ReactElement<DieProps>[];
      Roller?: (roll: () => void) => ReactElement;
      onRollGroup?: (result: RollGroupResult) => void;
      keyboardListeners?: string[];
    },
    ref,
  ) => {
    const dice = children
      ? Array.isArray(children)
        ? children
        : [children]
      : [...Array(diceCount).keys()].map(() => <Die size={diceSize} />);
    const { addGroup, getGroup } = useContext(DiceContext);
    const [diceComponents, setDiceComponents] = useState<ReactElement[]>([]);
    const roll = useRef<() => Promise<RollGroupResult>>(undefined);

    useImperativeHandle(ref, () => ({ rollGroup: roll.current }));
    useKeyboardRoller(keyboardListeners, roll.current);
    useEffect(() => {
      if (!getGroup(groupId)) {
        const { rollGroup, diceElements } = addGroup(groupId, dice);
        setDiceComponents(diceElements);
        roll.current = rollGroup;
      }
    }, [groupId, diceCount, dice]);

    return (
      <div
        style={{
          display: `flex`,
          flexDirection: `column`,
          rowGap: 10,
          ...diceAndRollerContainerStyle,
        }}
      >
        <div
          style={{
            display: `flex`,
            columnGap: 10,
            ...containerStyle,
          }}
        >
          {diceComponents.map((die) => die)}
        </div>
        {Roller &&
          Roller(async () => {
            if (roll.current) {
              const rollResult = await roll.current();
              onRollGroup?.(rollResult);
            }
          })}
      </div>
    );
  },
);
