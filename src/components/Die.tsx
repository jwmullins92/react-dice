import { Property } from "csstype";
import {
  CSSProperties,
  forwardRef,
  ReactElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { DiceContext } from "../context/DiceContext";
import { Face } from "../types/types";
import { getRandomDieValue, parseSizeToPixels } from "../util/functions";
import { useKeyboardRoller } from "../hooks/hooks";

export const Die = forwardRef(
  (
    {
      id,
      size = `50px`,
      onRoll,
      Roller,
      containerStyle,
      keyboardListeners = [],
      onClick,
      initialValue,
    }: {
      id?: string;
      size?: Property.Width<string | number>;
      onRoll?: (value: Face) => void;
      Roller?: (roll: () => void) => ReactElement;
      containerStyle?: CSSProperties;
      keyboardListeners?: string[];
      onClick?: (roll: () => void) => void;
      initialValue?: Face;
    },
    ref,
  ) => {
    const [value, setValue] = useState<Face>(initialValue ?? 1);
    const [rolling, setRolling] = useState(false);
    const [freeze, setFreeze] = useState(false);
    const { registerDie, unregisterDie } = useContext(DiceContext);

    const toggleSave = () => setFreeze(!freeze);
    const roll = (): Promise<Face> => {
      if (freeze || rolling) return new Promise((resolve) => resolve(value));
      setRolling(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          const rollValue = getRandomDieValue();
          setRolling(false);
          setValue(rollValue);
          onRoll?.(rollValue);
          resolve(rollValue);
        }, 750);
      });
    };

    useKeyboardRoller(keyboardListeners, roll);

    useEffect(() => {
      if (id) {
        registerDie({ id, roll, toggleSave });
        return () => unregisterDie(id);
      }
    }, [id, freeze]);

    useImperativeHandle(ref, () => ({ roll, toggleSave }));
    const rotate = (axis: `X` | `Y`, degrees: number) =>
      `rotate${axis}(${degrees}deg)`;

    const translateZ = `${parseSizeToPixels(size) / (typeof size == `string` && size.includes(`%`) ? 4 : 2)}px`;

    const sides = [
      { pips: [0, 1, 0], sidePlacement: ``, show: `` },
      {
        pips: [1, 0, 1],
        sidePlacement: rotate(`X`, -90),
        show: rotate(`X`, 90),
      },
      {
        pips: [1, 1, 1],
        sidePlacement: rotate(`Y`, -90),
        show: rotate(`Y`, 90),
      },
      {
        pips: [2, 0, 2],
        sidePlacement: rotate(`Y`, 90),
        show: rotate(`Y`, -90),
      },
      {
        pips: [2, 1, 2],
        sidePlacement: rotate(`X`, 90),
        show: rotate(`X`, -90),
      },
      {
        pips: [2, 2, 2],
        sidePlacement: rotate(`Y`, 180),
        show: rotate(`Y`, 180),
      },
    ];

    return (
      <div style={containerStyle}>
        <div
          onClick={() => {
            if (!rolling) {
              if (onClick) onClick(roll);
              else void roll();
            }
          }}
          style={{
            height: size,
            width: size,
            aspectRatio: 1,
            perspective: 10000,
            position: `relative`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
          }}
        >
          <div
            style={{
              transformStyle: `preserve-3d`,
              transform: sides[value - 1]!.show,
              transition: `all 1s linear`,
            }}
            className={`w-full h-full relative ${rolling ? `animate-roll` : ``}`}
          >
            {sides.map(({ pips, sidePlacement }, i) => {
              return (
                <div
                  key={i}
                  style={{
                    transform: `${sidePlacement} translateZ(${translateZ})`,
                  }}
                  className={`flex flex-col items-center justify-center h-full w-full ${freeze ? `bg-red-400` : `bg-black`} absolute border p-2`}
                >
                  {pips.map((rowPips, i) => {
                    return (
                      <div
                        key={i}
                        className={`h-1/3 w-full flex items-center ${
                          i == 0 && rowPips > 1
                            ? `justify-between`
                            : i == 1 && rowPips < 2
                              ? `justify-center`
                              : i == 2 && rowPips < 2
                                ? `justify-end`
                                : `justify-between`
                        }`}
                      >
                        {[...Array(rowPips)].map((_, i) => (
                          <span
                            key={i}
                            className={`h-2/3  bg-white aspect-square rounded-full`}
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        {Roller && Roller(roll)}
      </div>
    );
  },
);
