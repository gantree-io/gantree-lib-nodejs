# Library - Quick Start

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/03/30   |

- [Library - Quick Start](#library---quick-start)
  - [Prerequisites](#prerequisites)
  - [Tutorial](#tutorial)

## Prerequisites

This tutorial assumes you have the following files/knowledge/etc.

- Your own Gantree configuration
- An installation of gantree-lib and it's external dependencies
- Required environment variables exported

If any of these are unfamiliar, please consult further Gantree documentation.

## Tutorial

In this guide we're going to be creating the infrastructure outlined in your Gantree configuration using the library.

Since we're not going to be using the CLI, let's make our own script called `useGantree.js`.

First, we're going to want to make the Gantree class from the gantree-lib package available in our script.

```js
const { Gantree } = require('gantree-lib') // make Gantree class available
```

Now we want to define the file path to our Gantree configuration. You can do this however you see fit.

For the sake of simplicity, we're going to make this variable static.

Note that our variable name is only upper-case as this is considered best practice for static variables. In most other instances, you would likely use a `camelCase` naming scheme.

```js
const GANTREE_CONFIG_PATH = "/home/<username>/<path>/<to>/<my>/<config>/<config_filename>.json"
```

Now let's begin writing a new async function. For this tutorial, we'll name it `run`.

We're also going to execute it right after it's definition.

```js
async function run() {
    // our async code
}

run()
```

We're going to write the remainder of our code inside this async function.

Next, we'll instantiate a new object called 'gantree' from the imported class.

```js
gantree = new Gantree() // instantiate a new Gantree object
```

Now we want to load our Gantree configuration as an object.

For this we use the `returnConfig` method of our `gantree` variable. *Do not load the file in by another method*.

```js
const gantreeConfigObj = await gantree.returnConfig(GANTREE_CONFIG_PATH) // load and process Gantree configuration
```

We use this method instead of importing the file ourselves as it includes additional important functionality; `returnConfig` will _read_, _validate_ and _preprocess_ our Gantree configuration before we start using it.

Without validation, invalid configurations may result in errors during runtime or subtle/major deviations from our desired infrastructure. Furthermore, preprocessing allows for data to be transformed as necessary, such as when using references to environment variables in your Gantree configuration.

Lastly, we'll execute the `syncAll()` method with `gantreeConfigObj` as an argument. This method is responsible for creating our infrastructure and turning our instances into nodes.

```js
await gantree.syncAll(gantreeConfigObj) // sync our infrastructure and nodes
```

Our final `useGantree.js` script should look like this

```js
const { Gantree } = require('gantree-lib') // make Gantree available
const GANTREE_CONFIG_PATH = "/home/<username>/<path>/<to>/<my>/<config>/<config_filename>.json"

async function run() {
    gantree = new Gantree() // instantiate a new Gantree object
    const gantreeConfigObj = await gantree.returnConfig(GANTREE_CONFIG_PATH) // load and process Gantree configuration
    await gantree.syncAll(gantreeConfigObj) // sync our infrastructure and nodes
}
```

In the event you've forgotten to export any required environment variables, Gantree will stop execution early and inform you as to what you're missing.

Providing you've done everything correctly, you should now be able to create your infrastructure using

```bash
node useGantree.js
```

If you're experiencing any unhandled errors - even after following this tutorial word-for-word - please don't hesitate to submit an issue on Github. The more details you give us, the easier it is for us to help you out and potentially fix bugs for everyone.

<!--basic CLI instructions for reference

## Usage

### Synchronisation

Before attempting to run sync, ensure all tasks outlined in [requirements](#requirements) have been completed.

- You've installed all requirements
- All relevant environment variables are exported
- You've nagivated to the root of the cloned repo

To synchronise your configuration with digital infrastructure, run the following:

```bash
gantree-cli sync
```

### Cleaning up

You can remove all the created infrastructure with:

```bash
gantree-cli clean
``` -->
