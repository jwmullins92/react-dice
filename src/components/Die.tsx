import { Property } from "csstype";
import { motion, useAnimation } from "framer-motion";
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
import { useKeyboardRoller } from "../util/hooks";

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
    const controls = useAnimation();
    const roll = async (): Promise<Face> => {
      if (freeze || rolling) return value;
      const rollValue = getRandomDieValue();
      const orientation = sides[value - 1]!.show;
      const getRotationArray = (axis: `x` | `y`) => [
        orientation[axis],
        360 + orientation.x,
        720 + sides[rollValue - 1]!.show[axis],
      ];
      setRolling(true);
      await controls.start(
        {
          rotateX: getRotationArray(`x`),
          rotateY: getRotationArray(`y`),
        },
        {
          duration: 2,
          ease: "linear",
          times: [0, 0.5, 1],
        },
      );
      setRolling(false);
      setValue(rollValue);
      onRoll?.(rollValue);
      return rollValue;
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

    console.log(value);

    const sides = [
      {
        pips: [0, 1, 0],
        sidePlacement: ``,
        show: {
          x: 0,
          y: 0,
        },
      },
      {
        pips: [1, 0, 1],
        sidePlacement: rotate(`X`, -90),
        show: {
          x: 90,
          y: 0,
        },
      },
      {
        pips: [1, 1, 1],
        sidePlacement: rotate(`Y`, -90),
        show: {
          x: 0,
          y: 90,
        },
      },
      {
        pips: [2, 0, 2],
        sidePlacement: rotate(`Y`, 90),
        show: {
          x: 0,
          y: -90,
        },
      },
      {
        pips: [2, 1, 2],
        sidePlacement: rotate(`X`, 90),
        show: {
          x: -90,
          y: 0,
        },
      },
      {
        pips: [2, 2, 2],
        sidePlacement: rotate(`Y`, 180),
        show: {
          x: 0,
          y: 180,
        },
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
            perspective: 1000,
            position: `relative`,
            display: `flex`,
            alignItems: `center`,
            justifyContent: `center`,
          }}
        >
          <motion.div
            animate={controls}
            style={{
              transformStyle: `preserve-3d`,
              height: `100%`,
              width: `100%`,
              position: `relative`,
            }}
          >
            {(sides ?? []).map(({ pips, sidePlacement }, i) => {
              return (
                <div
                  key={i}
                  style={{
                    transform: `${sidePlacement} translateZ(${translateZ})`,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    height: `100%`,
                    width: `100%`,
                    position: `absolute`,
                    background: freeze ? `red` : `black`,
                    border: `1px solid white`,
                    boxSizing: `border-box`,
                    padding: `15%`,
                  }}
                >
                  {(pips ?? []).map((rowPips, i) => {
                    return (
                      <div
                        style={{
                          height: `33%`,
                          width: `100%`,
                          display: `flex`,
                          alignItems:
                            i == 0 ? `start` : i == 1 ? `center` : `end`,
                          justifyContent:
                            i == 0 && rowPips > 1
                              ? `space-between`
                              : i == 1 && rowPips < 2
                                ? `center`
                                : i == 2 && rowPips < 2
                                  ? `end`
                                  : `space-between`,
                        }}
                        key={i}
                      >
                        {[...Array(rowPips)].map((_, i) => (
                          <span
                            style={{
                              height: `75%`,
                              backgroundColor: `white`,
                              aspectRatio: 1,
                              borderRadius: `50%`,
                            }}
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
          </motion.div>
        </div>
        {Roller && Roller(roll)}
      </div>
    );
  },
);
