# react-dice-3d

Customizable 3D dice with individual and group logic features

## Installation

Install with [npm](https://www.npmjs.com/get-npm):

```
npm install react-dice-3d
```

## Quick Start

Wrap your `App` or section of your app with the `<DiceProvider>` component:

```tsx
import { DiceProvider } from "react-dice-3d";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DiceProvider>
    <App />
  </DiceProvider>,
);
```

The <DiceProvider> component is required to manage the state and context for dice rolling throughout your app.

Import the `Die` component.

```tsx
import { Die } from "./Die";

<Die onRoll={(value) => console.log(value)} />;
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
| Roller            | (roll: () => void) => ReactElement | -       | Function that receives a `roll` function for functional control over die roll. Returns a react element that you can use to trigger the roll (e.g., a button).     |
| containerStyle    | React.CSSProperties                | -       | Style object for setting the style of the container that holds the die. Height/width will always be set by the `size` prop                                        |
| keyboardListeners | string[]                           | -       | Accepts an array of keyboard buttons that will trigger a die roll                                                                                                 |
| onClick           | (roll: () => void) => void         | -       | Function that receives a roll function. Used to add extra behavior during a click. By default clicking on a Die will roll it unless it is part of a `<DiceGroup>` |
| initialValue      | number 1-6                         | 1       | Sets the intial value and face that shows on first render                                                                                                         |
| rollDuration      | number                             | 1       | Sets the time it takes to complete a roll in seconds                                                                                                              |
| theme             | "light" \| "dark" \| "metallic"    | "light" | Applies default stylings to the die                                                                                                                               |
| faceBackground    | React.CSSProperties.background     | -       | Set background style of the die. Accepts anything that the css `background` property accepts, including colors, gradients, or images                              |
| pipBackground     | React.CSSProperties.background     | -       | Set background style of the pips. Accepts anything that the css `background` property accepts, including colors, gradients, or images                             |
| useNumerals       | boolean                            | -       | If `true`, will use numbers instead of pips                                                                                                                       |

#### Controlling the `Die`

You have multiple options for triggering a die roll:

##### via props

- `keyboardListeners` roll die via keypress
- `Roller` gives you a programmatic roll function and returns an element to act as a roll controller.
- `onClick` allows you to augment the default behavior of the click roll by giving you the roll function to call after you implement your logic.

##### via hook

You can have programmatic access to a die via the `useDie()` hook by giving the die an id:

```tsx
import {useDie} from "react-dice-3d";

const die = useDie("my-die");

<Die id="my-die" />
<button onClick={() => die.roll()}>Hook Roll</button>
```

`useDie()` returns two functions:

```typescript
{
    roll: () => Promise<number>
    toggleFreeze: () => void
}
```

See `<DiceGroup>` section for more on `toggleFreeze()`

##### via ref

```tsx
const dieRef = useRef(null);

<Die ref={dieRef} />
<button onClick={() => dieRef.current.roll()}>Ref Roll</button>
```

You get the same functions that you get from the `useDie()` hook:

```typescript
{
    roll: () => Promise<number>;
    toggleFreeze: () => void;
}
```

### `<DiceGroup>`

Groups dice for rolling and grouping results together.

The default behavior of clicking a die in a group is to freeze the result. If a die is frozen, it will not roll when the group rolls and it's value will be saved and used by the `RollGroupResult` on group roll.

#### Basic usage

All you need to do is import the component and give it a `diceCount`

```tsx
import { DiceGroup } from "react-dice-3d";

<DiceGroup diceCount={3} useDefaultRoller />;
```

#### Props

| Prop                        | Type                                                | Default    | Description                                                                                                                                                          |
|:----------------------------|:----------------------------------------------------|:-----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id                          | string                                              | randomUUID | Provide an id for programmatic access to group                                                                                                                       |
| onRollGroup                 | (result: RollGroupResult) => void                   | -          | Function that receives the result of the group roll. The result is an object containing the `values`, `sum`, and `groupings` (see below for details)                 |
| rollDuration                | number                                              | 1          | Sets the time it takes to complete a roll in seconds                                                                                                                 |
| diceSize                    | string \| number                                    | -          | Sets the size of the dice in the group. A die is 50px by default                                                                                                     |
| diceCount                   | number                                              | 0          | Number of dice in the group                                                                                                                                          |
| children                    | ReactElement<DieProps> \| ReactElement<DieProps>[]; | -          | Children of the `DiceGroup` wrapper. These must be `Die` components. `DiceGroup` will throw out anything that is not a `Die` component                               |
| Roller                      | (roll: () => void) => ReactElement                  | -          | Function that receives a `roll` function for functional control over dice group roll. Returns a react element that you can use to trigger the roll (e.g., a button). |
| containerStyle              | React.CSSProperties                                 | -          | Style object for setting the style of the container that holds the group. Byt default the group is in a flexbox with a column gap of 25px                            |
| diceAndRollerContainerStyle | React.CSSProperties                                 | -          | If you are using a Roller, this styles the container that both the group and roll component are in. By default it is a flexbox column with row gap of 10px           |
| keyboardListeners           | string[]                                            | -          | Accepts an array of keyboard buttons that will trigger a group roll                                                                                                  |
| theme                       | "light" \| "dark" \| "metallic"                     | "light"    | Applies default stylings to the dice in the group                                                                                                                    |
| useDefaultRoller            | boolean                                             | -          | Adds a roll button with default styling                                                                                                                              |

##### RollGroupResult:

```typescript
{
    values: number[];
    sum: number;
    groupings: Record<number, number>;
}
```

- `values` is an array of the individual die values
- `sum` is the sum of all values
- `groupings` is an object whose keys are the result of a roll the value is how many times that result appears.
  - Ex. a roll of 5, 5, 4, 3, 3 would give you a grouping of:
    - `{ 3: 2, 4: 1, 5: 2}`

#### Controlling the `DiceGroup`

Like the `Die` component, you have several options for controlling the `DiceGroup`

##### via props

- `keyboardListeners` roll group via keypress
- `Roller` gives you a programmatic roll function and returns an element to act as a group roll controller.

##### via hook

You can have programmatic access to a dice group via the `useDiceGroup()` hook by giving the `DiceGroup` an id:

```tsx
import {useDiceGroup} from "react-dice-3d";

const group = useDiceGroup(`my-group`);

<DiceGroup id={`my-group`} />
<button onClick={() => group.roll()}>Hook Roll</button>
```

##### via ref

```tsx
const diceGroupRef = useRef(null);
```

```tsx
<DiceGroup ref={diceGroupRef} diceCount={3}/>
<button onClick={() => diceGroupRef.current.roll()}>Ref Roll</button>
```

#### Advanced Usage

If you want more granular control over the dice in a group you can use `DiceGroup` as a wrapper and define `Die` components inside:

```tsx
const thirdDie = useDie("third-die");

<DiceGroup onRollGroup={(result) => {
    console.log(result.values, result.sum, result.groupings)
}} diceSize={150}>
  <Die size={50} initialValue={6} keyboardListeners={['a']} useNumerals />
  <Die theme={`dark`} onClick={(roll) => {
      console.log(`rolling second die`);
      roll();
  }} />
  <Die id={`third-die`} onRoll={(value) => {
      console.log(value);
      doSomething(value);
  }} theme={`metallic`} />
</DiceGroup>

<button onClick={() => thirdDie.toggleFreeze()}>
```

You can use props to apply to all dice in a group and control/style individual die this way while still maintaining the group rolling/result logic.

Notes about `GroupDice`:

- The default behavior of clicking a group die is to freeze it. You can freeze programmatically as shown above as well.
- You can use a combination of the wrapper and `Die` components and `diceCount` prop. `diceCount` should be the total number of dice you want. If you do not have enough `Die` children, it will fill in with default `Die` components respecting the props of `DiceGroup`
