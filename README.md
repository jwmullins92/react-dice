# react-dice

Customizable 3D dice with individual and group logic features

## Installation

Install with [npm](https://www.npmjs.com/get-npm):

```
npm install react-dice
```

## Quick Start

Simply import the `Die` component.

```tsx
import Die from 'react-dice'
```

```tsx
<Die onRoll={(value) => console.log(value)} />
```

## Usage

### `<Die>`

A single die. Rolls on click by default.

#### Props

| Prop              | Type                               | Default | Description                                                                                                                                                       |
|:------------------|:-----------------------------------|:--------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------|  
| id                | string                             | -       | Used for accessing Die via hook                                                                                                                                   |
| size              | string \| number                   | 50px    | Size of the die                                                                                                                                                   |
| onRoll            | (value: number) => void            | -       | Function that receives the result of the die roll                                                                                                                 |
| Roller            | (roll: () => void) => ReactElement | -       | Function that receives a `roll` function for functional control over die roll. Returns a react elemnt.                                                            |
| containerStyle    | React.CSSProperties                | -       | Style object for setting the style of the container that holds the die. Height/width will always be set by the `size` prop                                        |
| keyboardListeners | string[]                           | -       | Accepts an array of keyboard buttons that will trigger a die roll                                                                                                 |
| onClick           | (roll: () => void) => void         | -       | Function that receives a roll function. Used to add extra behavior during a click. By default clicking on a Die will roll it unless it is part of a `<DiceGroup>` |
| initialValue      | number 1-6                         | 1       | Sets the intial value and face that shows on first render                                                                                                         |
| rollDuration      | number                             | 1       | Sets the time it takes to complete a roll in seconds                                                                                                              |
| theme             | "light" \| "dark" \| "metallic"    | "light" | Applies default stylings to the die                                                                                                                               |
| faceBackground    | React.CSSProperties.background     | -       | Set background style of the die. Accepts anything that the css `background` property accepts, including colors, gradients, or images                              |
| pipBackground     | React.CSSProperties.background     | -       | Set background style of the pips. Accepts anything that the css `background` property accepts, including colors, gradients, or images                             |
| useNumerals       | boolean                            | -       | If `true`, will use numbers instead of pips                                                                                                                       |

#### Controlling the `<Die>`

You have multiple options for triggering a die roll:

##### via props

- `keyboardListeners` roll die via keypress
- `Roller` gives you a programmatic roll function and returns an element to act as a roll controller.
- `onClick` allows you to augment the default behavior of the click roll by giving you the roll function to call after you implement your logic.

##### via hook

You can have programmatic access to a die via the `useDie()` hook by giving the die an id:

```tsx
import {useDie} from "./hooks";

const die = useDie("my-die")
```

```tsx
<Die id="my-die" />
```

`useDie()` returns two functions:

```typescript
{
    roll: () => Promise<number>
    toggleSave: () => void
}
```

See `<DiceGroup>` section for more on `toggleSave()`

##### via ref

```tsx
const dieRef = useRef(null)
```

```tsx
<Die ref={dieRef} />
<button onClick={() => die.current.roll()}>Ref Roll</button>
```

You get the same functions that you get from the `useDie()` hook:

```typescript
{
    roll: () => Promise<number>
    toggleSave: () => void
}
```