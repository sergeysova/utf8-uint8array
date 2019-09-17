# utf8-uint8array

## Installation

```bash
npm install utf8-uint8array
```

or

```bash
yarn add utf8-uint8array
```

## Encode UTF-8 string as Uint8Array

```ts
import { toBytes } from "utf8-uint8array";

const bytes: Uint8Array = toBytes("Привет 🌎");
```

## Decode Uint8Array as UTF-8 string

```ts
import { fromBytes } from "utf8-uint8array";

const bytes: Uint8Array;

const string: string = fromBytes(bytes);
```
