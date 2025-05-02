import { Property } from "csstype";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  CSSProperties,
  forwardRef,
  ReactElement,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { DiceContext } from "../context/DiceContext";
import { Face } from "../types/types";
import { diceThemes, sides, Theme } from "../util/dieHelpers";
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
      initialValue = 1,
      rollDuration = 1,
      theme = `light`,
      faceBackground,
      pipBackground,
      useNumerals,
    }: {
      id?: string;
      size?: Property.Width<string | number>;
      onRoll?: (value: Face) => void;
      Roller?: (roll: () => void) => ReactElement;
      containerStyle?: CSSProperties;
      keyboardListeners?: string[];
      onClick?: (roll: () => void) => void;
      initialValue?: Face;
      rollDuration?: number;
      theme?: Theme;
      faceBackground?: Property.Background;
      pipBackground?: Property.Background;
      useNumerals?: boolean;
    },
    ref,
  ) => {
    const sizeInPixels = parseSizeToPixels(size);
    const [value, setValue] = useState<Face>(initialValue);
    const [rolling, setRolling] = useState(false);
    const [freeze, setFreeze] = useState(false);
    const [containerSize, setContainerSize] = useState(sizeInPixels);
    const containerRef = useRef(null);
    const { registerDie, unregisterDie } = useContext(DiceContext);

    useEffect(() => {
      if (!containerRef.current) return;

      const observer = new ResizeObserver(([entry]) =>
        setContainerSize(entry!.contentRect.height),
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }, []);

    const dieTheme = diceThemes[theme];
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
          duration: rollDuration,
          ease: [`easeIn`, `easeOut`],
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

    const translateZ = containerSize / 2;
    return (
      <div
        ref={containerRef}
        style={{
          ...containerStyle,
          boxSizing: `border-box`,
          aspectRatio: 1,
          width: containerSize,
          height: containerSize,
        }}
      >
        <div
          onClick={() => {
            if (!rolling) {
              if (onClick) onClick(roll);
              else void roll();
            }
          }}
          style={{
            height: `100%`,
            width: `100%`,
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
              translateZ: -translateZ,
            }}
          >
            {sides.map(({ pips, sidePlacement }, i) => {
              return (
                <div
                  key={i}
                  style={{
                    transform: `${sidePlacement} translateZ(${rolling ? translateZ : value == i + 1 ? translateZ + 5 : translateZ * 0.8}px)`,
                    transformOrigin: `center center center`,
                    display: `flex`,
                    flexDirection: `column`,
                    alignItems: `center`,
                    justifyContent: `center`,
                    height: `100%`,
                    width: `100%`,
                    position: `absolute`,
                    border: dieTheme.face?.border,
                    borderRadius: `5%`,
                    boxSizing: `border-box`,
                    padding: `15%`,
                    ...dieTheme.face,
                    background: faceBackground ?? dieTheme.face?.background,
                  }}
                >
                  {pips && !useNumerals ? (
                    pips.map((rowPips, i) => {
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
                                aspectRatio: 1,
                                borderRadius: `50%`,
                                ...dieTheme.pips,
                                background:
                                  pipBackground ?? dieTheme.pips?.background,
                              }}
                              key={i}
                              className={`h-2/3  bg-white aspect-square rounded-full`}
                            />
                          ))}
                        </div>
                      );
                    })
                  ) : (
                    <div
                      style={{
                        height: `100%`,
                        width: `100%`,
                        display: `flex`,
                        alignItems: `center`,
                        justifyContent: `center`,
                        color: "rgba(0, 0, 0, 1)",
                        fontSize: parseSizeToPixels(size) * 0.7,
                        WebkitTextStroke: "1px rgba(30, 30, 30, 0.6)",
                        position: `relative`,
                        fontFamily: `'Rounded', sans-serif`, // Apply your bundled font here
                      }}
                    >
                      <span
                        style={{
                          position: "relative",
                          zIndex: 1 /* Ensure text is above pseudo-element */,
                          background: `linear-gradient(135deg, rgb(0, 0, 0), rgb(100, 100, 100))`,
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {i + 1}
                      </span>
                    </div>
                  )}
                  <AnimatePresence>
                    {freeze && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          height: `0%`,
                          width: `100%`,
                        }}
                        animate={{
                          opacity: 0.2,
                          height: `100%`,
                          width: `100%`,
                          originY: `0%`,
                        }}
                        style={{
                          background: theme == `dark` ? `white` : `black`,
                          position: `absolute`,
                          borderRadius: `5%`,
                        }}
                        key="modal"
                        exit={{
                          opacity: 0,
                          height: 0,
                          width: 0,
                        }}
                      />
                    )}
                  </AnimatePresence>
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
