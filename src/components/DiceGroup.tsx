import { Property } from "csstype";
import {
  cloneElement,
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
import { Theme } from "../util/dieHelpers";
import { useKeyboardRoller } from "../util/hooks";
import { Die } from "./Die";

type DieProps = ComponentProps<typeof Die>;

export const DiceGroup = forwardRef(
  (
    {
      diceCount = 0,
      diceSize = `50px`,
      containerStyle,
      diceAndRollerContainerStyle,
      groupId,
      children,
      Roller,
      onRollGroup,
      keyboardListeners = [],
      rollDuration,
      theme = `light`,
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
      rollDuration?: number;
      theme?: Theme;
    },
    ref,
  ) => {
    const [rolling, setRolling] = useState(false);
    const childArray = (Array.isArray(children) ? children : [children]).filter(
      Boolean,
    ) as ReactElement<DieProps>[];

    const dice = (
      children
        ? [
            ...childArray!.map((child) =>
              cloneElement(child, {
                theme,
                rollDuration,
                size: diceSize,
                ...child.props,
              }),
            ),
            ...(diceCount && diceCount - childArray.length > 0
              ? [...Array(diceCount - childArray.length)].map(() => (
                  <Die size={diceSize} {...{ rollDuration, theme }} />
                ))
              : []),
          ]
        : [...Array(diceCount).keys()].map(() => (
            <Die size={diceSize} {...{ rollDuration, theme }} />
          ))
    ) as ReactElement<DieProps>[];

    const { addGroup, getGroup } = useContext(DiceContext);
    const [diceComponents, setDiceComponents] = useState<ReactElement[]>([]);
    const roller = useRef<() => Promise<RollGroupResult>>(() =>
      Promise.resolve({
        values: [],
        sum: 0,
        groupings: {},
      }),
    );

    const roll = async () => {
      if (!rolling) {
        setRolling(true);
        const rollResult = await roller.current();
        onRollGroup?.(rollResult);
        setRolling(false);
      }
    };

    useImperativeHandle(ref, () => ({ rollGroup: roller.current }));
    useKeyboardRoller(keyboardListeners, roll);
    useEffect(() => {
      if (!getGroup(groupId)) {
        const { rollGroup, diceElements } = addGroup(groupId, dice);
        setDiceComponents(diceElements);
        roller.current = rollGroup;
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
            columnGap: 25,
            ...containerStyle,
          }}
        >
          {diceComponents.map((die) => {
            return die;
          })}
        </div>
        {Roller && Roller(roll)}
      </div>
    );
  },
);
