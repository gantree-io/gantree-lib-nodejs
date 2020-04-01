<a name="Gantree"></a>

## Gantree
Abstracted class used for library interaction.

**Kind**: global class  

* [Gantree](#Gantree)
    * [new Gantree()](#new_Gantree_new)
    * [.returnConfig(path)](#Gantree+returnConfig) ⇒ <code>object</code>
    * [.syncAll(gantreeConfigObj)](#Gantree+syncAll)
    * [.cleanAll(gantreeConfigObj)](#Gantree+cleanAll)

<a name="new_Gantree_new"></a>

### new Gantree()
Abstracted class used for library interaction.

<a name="Gantree+returnConfig"></a>

### gantree.returnConfig(path) ⇒ <code>object</code>
Validate, preprocess and return a Gantree configuration from a JSON file.

**Kind**: instance method of [<code>Gantree</code>](#Gantree)  
**Returns**: <code>object</code> - gantreeConfigObj  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to a Gantree configuration, file must be JSON. |

<a name="Gantree+syncAll"></a>

### gantree.syncAll(gantreeConfigObj)
Create/update infrastructure in Gantree configuration.

**Kind**: instance method of [<code>Gantree</code>](#Gantree)  

| Param | Type | Description |
| --- | --- | --- |
| gantreeConfigObj | <code>object</code> | Gantree configuration, must come from returnConfig. |

<a name="Gantree+cleanAll"></a>

### gantree.cleanAll(gantreeConfigObj)
Destroy infrastructure in Gantree configuration.

**Kind**: instance method of [<code>Gantree</code>](#Gantree)  

| Param | Type | Description |
| --- | --- | --- |
| gantreeConfigObj | <code>object</code> | Gantree configuration, must come from returnConfig. |

