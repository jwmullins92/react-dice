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

    |   Prop    |   Type    |   Default |   Description |
    |   id      |   string  |   -       |   Used for accessing Die via hook |