# Library - Usage

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/04/01   |

## Usage

All important interactions with gantree-lib are performed via an object instantiated by the Gantree class.

```js
const { Gantree } = require('gantree-lib')
const gantree = new Gantree()
```

## Methods

`gantree.returnConfig(*gantreeConfigPath*)`

## Syncing

```js
gantree.syncAll()
