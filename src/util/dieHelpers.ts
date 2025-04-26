import { CSSProperties } from "react";

export type Theme = `black` | `white` | `metallic`;

const rotate = (axis: `X` | `Y`, degrees: number) => `rotate${axis}(${degrees}deg)`;

const gradients = {
	black: {
		subtleDark: `linear-gradient(0deg, #000000 0%, #222222 100%)`,
		horizontalFade: `linear-gradient(90deg, #000000 0%, #111111 50%, #000000 100%)`,
		darkRadial: `radial-gradient(circle at 75% 65%, #888888 0%, #111111 30%, #222222 100%)`,
		diagonalDarkBand: `linear-gradient(45deg, #111111 0%, #000000 50%, #333333 100%)`,
		verticalAscent: `linear-gradient(180deg, #333333 0%, #111111 50%, #000000 100%)`,
		blackMetal: `linear-gradient(135deg, #111111 0%, #222222 20%, #ffffff 30%, #222222 40%, #111111 100%)`,
		subtleShine: `linear-gradient(135deg, #111111 0%, #1a1a1a 55%, #333333 65%, #999999 70%, #222222 80%, #111111 100%)`,
		abyss: `linear-gradient(0deg, #111111 0%, #333333 100%)`,
		charcoalFade: `linear-gradient(90deg, #1a1a1a 0%, #3a3a3a 50%, #1a1a1a 100%)`,
		shadowRealm: `radial-gradient(circle, #222222 0%, #444444 70%, #666666 100%)`,
		obsidianDepth: `linear-gradient(45deg, #1a1a1a 0%, #333333 50%, #4d4d4d 100%)`,
		twilightDescent: `linear-gradient(180deg, #444444 0%, #222222 50%, #111111 100%)`
	},
	white: {
		eggshell: `linear-gradient(0deg, #f0f0e6 0%, #fafafa 100%)`,
		ivoryWash: `linear-gradient(90deg, #f8f8f0 0%, #fffafa 50%, #f8f8f0 100%)`,
		lighterIvory: `linear-gradient(90deg, #fcfcf4 0%, #fffef6 50%, #fcfcf4 100%)`,
		parchmentFade: `radial-gradient(circle, #fffff0 0%, #f5f5dc 70%, #f8f8ff 100%)`,
		linenBlend: `linear-gradient(45deg, #faf0e6 0%, #fffaf0 50%, #f0fff0 100%)`,
		seashellSoft: `linear-gradient(180deg, #fff5ee 0%, #fffafa 50%, #f8f8ff 100%)`,
		radialShine: `radial-gradient(circle at 75% 65%, #fff 0%, #fff 30%, #888 100%)`
	},
	metallic: {
		base: `linear-gradient(135deg, #d4d4d4 0%, #b0b0b0 15%, #8c8c8c 30%, #a3a3a3 50%, #7a7a7a 70%, #5e5e5e 85%, #919191 100%)`,
		shiny: `linear-gradient(135deg, #f0f0f0 0%, #dcdcdc 10%, #bababa 25%, #969696 45%, #c8c8c8 60%, #737373 75%, #525252 90%, #a9a9a9 100%)`,
		dark: `linear-gradient(135deg, #5a5a5a 0%, #454545 15%, #303030 30%, #4a4a4a 50%, #282828 70%, #181818 85%, #383838 100%)`,
		radial: `radial-gradient(circle at 30% 30%, #f0f0f0 5%, #c0c0c0 20%, #909090 40%, #707070 60%, #a0a0a0 80%, #808080 100%)`
	}
};

export const sides = [
	{
		pips: [0, 1, 0],
		sidePlacement: ``,
		show: {
			x: 0,
			y: 0
		}
	},
	{
		pips: [1, 0, 1],
		sidePlacement: rotate(`X`, -90),
		show: {
			x: 90,
			y: 0
		}
	},
	{
		pips: [1, 1, 1],
		sidePlacement: rotate(`Y`, -90),
		show: {
			x: 0,
			y: 90
		}
	},
	{
		pips: [2, 0, 2],
		sidePlacement: rotate(`Y`, 90),
		show: {
			x: 0,
			y: -90
		}
	},
	{
		pips: [2, 1, 2],
		sidePlacement: rotate(`X`, 90),
		show: {
			x: -90,
			y: 0
		}
	},
	{
		pips: [2, 2, 2],
		sidePlacement: rotate(`Y`, 180),
		show: {
			x: 0,
			y: 180
		}
	}
];

export const diceThemes: Record<Theme, { face?: CSSProperties; pips?: CSSProperties }> = {
	black: {
		face: { background: gradients.black.charcoalFade, border: `1px solid white` },
		pips: { background: gradients.white.radialShine }
	},
	white: {
		face: { background: gradients.white.lighterIvory, border: `1px solid #848884` },
		pips: { background: gradients.black.darkRadial }
	},
	metallic: {
		face: {
			background: gradients.metallic.shiny,
			border: `1px solid black`
		},
		pips: {
			background: gradients.black.darkRadial
		}
	}
} satisfies Record<Theme, { face?: CSSProperties; pips?: CSSProperties }>;
