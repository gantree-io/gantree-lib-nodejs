# Gantree Configuration - Basics

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/03/30   |

- [Gantree Configuration - Basics](#gantree-configuration---basics)
  - [Format](#format)
  - [Features](#features)
    - [Environment Variable References](#environment-variable-references)
  - [Structure](#structure)
    - [Root Object](#root-object)
    - [Metadata](#metadata)
    - [Binary](#binary)
      - [Binary Structure - Preset](#binary-structure---preset)
      - [Binary Structure - Repository](#binary-structure---repository)
      - [Binary Structure - Fetch](#binary-structure---fetch)
      - [Binary Structure - Local](#binary-structure---local)
    - [Nodes](#nodes)
      - [Instance](#instance)
        - [Amazon Web Services (AWS)](#amazon-web-services-aws)
        - [DigitalOcean (DO)](#digitalocean-do)
        - [Google Cloud Platform (GCP)](#google-cloud-platform-gcp)
    - [Defaults](#defaults)

## Format

Gantree configurations must be in JSON format.

## Features

### Environment Variable References

Gantree supports references to environment variables in the form of strings with special formatting

To use environment variables references in your Gantree configuration, define a key value as a string with the following structure:

```jsonc
"<key>": "$env:<env_variable_name>"
```

- `<key>` being any key, anywhere in the Gantree configuration
- `<env_variable_name>` being the environment variable you wish to reference

For example:

```jsonc
"sshPrivateKeyPath": "$env:GANTREE_INSTANCE_PRIVATE_KEY_PATH"
```

<p><img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_best_practice_tag.png" alt="Best practice tag" width="100">
Using too many environment variable references in a configuration is discouraged as it can lead to inconsistencies across environments, especially for those working in large teams. The significance of this however varies from project to project.
</p>

## Structure

The following subheadings outline portions of the Gantree configurations structure

**Optional** keys are indicated by the comments matching the format `// [default value] description`.

**Default values** for optional keys are indicated inside square brackets.

### Root Object

```jsonc
{
  "metadata": {}, // see Metadata
  "binary": {}, // see Binary
  "nodes": [] // see Nodes
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

#### Binary Structure - Preset

When using the preset method, all other binary keys will be parsed from a preset defined in Gantree itself.

Presets are defined in a file [here](../../src/static_data/binary_presets.json).

```jsonc
{
  "preset": "string" // Name of preset to use
}
```

#### Binary Structure - Repository

When using the repository format, a specified repository will be downloaded and a node will be compiled.

```jsonc
{
  "repository": {
    "url": "string", // URL of node repository
    "version": "string", // ["HEAD"] Version of repository
    "localCompile": "boolean" // [false] Compile binary on host (advanced)
  },
  "filename": "string" // Filename of compiled binary (e.g. `polkadot`)
}
```

#### Binary Structure - Fetch

When using the fetch format, binaries will be downloaded.

```jsonc
{
  "fetch": {
    "url": "string", // URL to download binary from
    "sha256": "string" // [false] Sha256 checksum of binary
  },
  "filename": "string" // Filename of compiled binary (e.g. `polkadot`)
}
```

### Nodes

An array defining the nodes in your infrastructure

```jsonc
[
    {
        "validator": "boolean", // [true] Should this node be a validator
        "mnemonic": "string", // [undefined] Mnemonic used to generate substrate keys
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

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_example_tag.png" alt="Example tag" width="100">

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

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_example_tag.png" alt="Example tag" width="100">

```jsonc
{
  "sshPrivateKeyPath": "string", // Path to private key for SSH
  "provider": "do", // Provider to use
  "dropletSize": "s-1vcpu-1gb", // DO Droplet size
  "region": "nyc3" // DO region
}
```

##### Google Cloud Platform (GCP)

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_example_tag.png" alt="Example tag" width="100">

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
