# Gantree Configuration - Basics

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/03/27   |

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

```jsonc
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

```jsonc
{
    "preset": "string" // Name of preset to use
}
```

#### Repository Format

When using the repository format, a specified repository will be downloaded and a node will be compiled.

```jsonc
{
    "repository": {
        "url": "string", // URL of node repository
        "version": "string", // ["HEAD"] Version of repository
        "localCompile": "boolean" // [false] Compile binary on host (advanced)
    },
    "filename": "string" // Filename of compiled binary
}
```

#### Fetch Format

When using the fetch format, binaries will be downloaded.

```jsonc
{
    "fetch": {
        "url": "string", // URL to download binary from
        "sha256": "string" // [false] Sha256 checksum of binary
    },
    "filename": "string" // Filename of compiled binary
}
```

#### Local Format

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_not_yet_implemented_tag.png" alt="Not yet implemented tag" width="100">

When using the local format, binaries will be grabbed from a local source

```jsonc
{
    "path": "string", // Path to binary file,
    "sha256": "string" // [false] Sha256 checksum of binary
}
```


### Nodes

An array defining the nodes in your infrastructure

**note:** "validator" key is not yet implemented

```jsonc
[
    {
        "validator": "boolean", // [false] Should this node be a validator
        "instance": {} // See Instance 
    },
    ... // etc.
]
```

#### Instance

Definition of the instance this node will be hosted on. 

The composition of instance is dependant on the provider specified. There are currently 3 providers supported.

Required keys for each providers are outlined below:

##### Amazon Web Services (AWS)

```jsonc
{
    "sshPrivateKeyPath": "string", // Path to private key for SSH
    "provider": "aws", // Provider to use
    "type": "t3.small", // AWS machine type
    "volumeSize": 200, // AWS volume size
    "region": "ap-southeast-2" // AWS region
}
```

##### DigitalOcean (DO)

```jsonc
{
    "sshPrivateKeyPath": "string", // Path to private key for SSH
    "provider": "do", // Provider to use
    "dropletSize": "s-1vcpu-1gb", // DO Droplet size
    "region": "nyc3", // DO region
}
```

##### Google Cloud Platform (GCP)

```jsonc
{
    "sshPrivateKeyPath": "string", // Path to private key for SSH
    "provider": "gcp", // Provider to use
    "type": "n1-standard-2", // GCP machine type
    "deletionProtection": "false", // GCP deletion protection
    "sizeGb": 100, // GCP volume size
    "zone": "us-east1-b", // GCP zone
    "projectId": "$env:GCP_PROJECT_NAME"
}
```

### Defaults

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_not_yet_implemented_tag.png" alt="Not yet implemented tag" width="100">

Define default values for required/optional keys for all nodes

These values are injected at runtime unless already defined on nodes themselves.

```jsonc
{
    // Not yet implemented
    // Structure still in flux
}
```
