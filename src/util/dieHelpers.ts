import { CSSProperties } from "react";

export type Theme = `light` | `dark` | `metallic`;
const rotate = (axis: `X` | `Y`, degrees: number) =>
  `rotate${axis}(${degrees}deg)`;

export const gradients = {
  black: {
    darkRadial: `radial-gradient(circle at 75% 65%, #888888 0%, #111111 30%, #222222 100%)`,
    blackMetal: `linear-gradient(135deg, #111111 0%, #222222 20%, #ffffff 30%, #222222 40%, #111111 100%)`,
    charcoalFade: `linear-gradient(90deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%)`,
  },
  white: {
    ivoryWash: `linear-gradient(90deg, #f8f8f0 0%, #fffafa 50%, #f8f8f0 100%)`,
    radialShine: `radial-gradient(circle at 75% 65%, #fff 0%, #fff 30%, #888 100%)`,
    reflectiveVeinRadial: `radial-gradient(ellipse at 60% 65%, #ffffff 50%, #eeeeee 90%, #e5e5e5 100%)`,
    reflectiveVeinLinear: `linear-gradient(135deg, #f5f5f5 12%, #f7f7f7 55%, #ffffff 60%, #f7f7f7 70%)`,
    polishedIvory: `radial-gradient(ellipse at center, #fffff0 0%, #f8f8e3 50%, #fffaf0 100%)`,
  },
  metallic: {
    base: `linear-gradient(135deg, #d4d4d4 0%, #b0b0b0 15%, #8c8c8c 30%, #a3a3a3 50%, #7a7a7a 70%, #5e5e5e 85%, #919191 100%)`,
    shiny: `linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 10%, #bababa 25%, #969696 45%, #c8c8c8 60%, #737373 75%, #525252 90%, #a9a9a9 100%)`,
    dark: `linear-gradient(135deg, #5a5a5a 0%, #454545 15%, #303030 30%, #4a4a4a 50%, #282828 70%, #181818 85%, #383838 100%)`,
    radial: `radial-gradient(circle at 30% 30%, #f0f0f0 5%, #c0c0c0 20%, #909090 40%, #707070 60%, #a0a0a0 80%, #808080 100%)`,
  },
};

export const sides: {
  sidePlacement: string;
  show: { x: number; y: number };
  pips?: number[];
}[] = [
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

export const diceThemes: Record<
  Theme,
  { face?: CSSProperties; pips?: CSSProperties }
> = {
  dark: {
    face: {
      background: gradients.black.charcoalFade,
      border: `1px solid white`,
    },
    pips: { background: gradients.white.radialShine },
  },
  light: {
    face: {
      background: gradients.white.reflectiveVeinLinear,
      border: `1px solid #848884`,
    },
    pips: { background: gradients.black.darkRadial },
  },
  metallic: {
    face: {
      background: gradients.metallic.shiny,
      border: `1px solid black`,
    },
    pips: {
      background: gradients.black.darkRadial,
    },
  },
} satisfies Record<Theme, { face?: CSSProperties; pips?: CSSProperties }>;
