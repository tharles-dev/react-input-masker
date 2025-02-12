# MaskedInput

A versatile React component for input masking that supports live numeric formatting, generic masks (e.g., for CPF) and custom formatters. It also allows you to render a custom input component via the `as` prop. Use it to deliver a clear and guided input experience to your users.

## Features

- **Live Numeric Formatting:** Automatically format numbers as they are typed (e.g., inputting `1` becomes `1.00`, `55` becomes `5.5`, `555` becomes `5.55`, etc.).
- **Generic Masking:** Apply masks where `#` represents a digit (ideal for CPF, phone numbers, etc.).
- **Custom Formatter:** Pass your own formatting function if you need a specific format.
- **Custom Component Rendering:** Use the `as` prop to render your own input component (e.g., from a UI library) without losing the masking functionality.
- **TypeScript Support:** Fully typed for a robust developer experience.

## Installation

If this component is part of your project, simply add the `MaskedInput.tsx` file to your components folder.

> **Nota:** Caso o componente seja disponibilizado via npm, use:
>
> ```bash
> npm install react-input-masker
> or
> npm install react-input-masker --legacy-peer-deps
> ```

## Usage

Below are some examples showing how to use the `MaskedInput` component.

### Importing and Basic Usage

```tsx
import React from "react";
import { MaskedInput } from "./components/MaskedInput";

function App() {
  return (
    <div>
      <h1>MaskedInput Examples</h1>

      {/* Basic input with placeholder */}
      <MaskedInput placeholder="Teste Input" />

      {/* Generic mask example for CPF */}
      <MaskedInput mask="###.###.###-##" placeholder="CPF" />

      {/* Live numeric formatting example */}
      <MaskedInput mask={["#.##", "##.##"]} placeholder="Preço" />

      {/* Custom formatter example */}
      <MaskedInput
        formatter={(raw) => `Formatted: ${raw}`}
        placeholder="Custom Formatter"
      />

      {/* Custom component rendering using the 'as' prop */}
      <MaskedInput
        as={({ ...props }) => <input data-testid="custom-input" {...props} />}
        placeholder="Custom Component"
      />
    </div>
  );
}

export default App;
```
