# Gantree Configuration - Basics

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/03/26   |

## Format

Gantree configurations should be in JSON format.

## Structure

The following subheadings outline portions of the Gantree configurations structure

Optional keys are indicated by the comments matching the format `// [value] description`.

Default values for keys are indicated inside square brackets.

### Root Object

```jsonc
{
    "metadata": {}, // see Metadata
    "binary": {}, // see Binary
    "nodes": [], // see Nodes
    "defaults": {} // [{}] see Defaults (not yet implemented)
}
```

### Metadata

Contains information pertaining to the configuration and project itself

```json
{
    "version": "string", // Gantree configuration version
    "project": "string" // Name of Gantree project
}
```

### Binary

Defines how the binary which will be distributed to nodes will be acquired

The composition of binary can be in one of, _and only one of_, the following 4 formats:

#### Preset Format

When using the preset method, all other binary keys will be parsed from a preset defined in Gantree itself.

Presets are defined in a file [here](src/../../../src/static_data/binary_presets.json).

```json
{
    "preset": "string" // Name of preset to use
}
```

#### Repository Format

When using the repository format, a specified repository will be downloaded and a node will be compiled.

```json
{
    "repository": {
        "url": "string", // URL of node repository
        "version": "string", // ["HEAD"] Version of repository
        "localCompile": "bool" // [false] Compile binary on host (advanced)
    },
    "filename": "string" // Filename of compiled binary
}
```
