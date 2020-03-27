# Gantree Lib

Library at the core of Gantree

## About

Substrate is built on the core belief that the future will be multi-chain.

In the past, setting up and managing blockchain networks required an understanding of a multitude of concepts which may have inhibited end users from experimenting with them.

With the assistance of funding from the [Web3 Foundation](https://web3.foundation/), Flex Dapps is building a suite of technologies which will enable both power users and those less versed to create and manage substrate-powered parachain networks via rapid spin-up and tear-down of self-managed or cloud-hosted machines.

## Docker Image

If you would rather install dependencies automatically in a container, a Docker image is available here:
- [Docker image](https://github.com/flex-dapps/gantree-cli-docker).

## Requirements

### 1 - Application Requirements

When installed locally, Gantree-lib requires the following application dependencies:

| REQUIREMENT                                                                                   | VERSION   | NOTES                                                            |
| --------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| NodeJS                                                                                        | >=10.15.2 | Recommended install method: [nvm](https://github.com/nvm-sh/nvm) |
| [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) | >=2.9.4   | Recommended install method: pip                                  |
| Git                                                                                           | >=2.0     | Required by ansible-galaxy for installing roles                  |

### 2 - Ansible Requirements

Install required ansible roles

```bash
curl https://raw.githubusercontent.com/flex-dapps/gantree-requirements/master/ansible-galaxy/requirements.yml > ansible_requirements.yml
ansible-galaxy install -r ansible_requirements.yml
```

### 3 - Python Requirements

***Please note:*** *It is highly recommended to use a virtual environment such as _pipenv_ or _venv_*

Install required python packages

```bash
pip install ansible boto boto3 botocore requests google-auth
```

### 4 - Package Installation

Install gantree-lib

```bash
npm install gantree-lib -g
```

## Environment Requirements

### Provider Credentials

For security reasons, credentials for infrastructure providers must be exported as environment variables.

| PROVIDER     | EXPORTS REQUIRED                                | NOTES                                                                                                                                                       |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS          | `AWS_ACCESS_KEY_ID`</br>`AWS_SECRET_ACCESS_KEY` | IAM account with EC2 and VPC write access.                                                                                                                  |
| GCP          | `GCP_SERVICE_ACCOUNT_FILE`                      | path to json file with credentials of the service account you want to use; this service account needs to have write access to compute and network resources |
| DigitalOcean | `DO_API_TOKEN`                                  | A DigitalOcean access token with read + write access                                                                                                        |

<img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_related_note_tag.png" alt="Not yet implemented tag" width="100">
You only need credentials for providers you wish to use

### SSH Credentials

You must generate this key pair yourself and add it to your ssh-agent.

**Important: Key pairs must be PEM.**

**note:** Don't forget to add the private key to you ssh-agent otherwise you will get **_Permission denied (publickey)_** during ansible tasks


## Configuration

Gantree requires a configuration file (Gantree configuration) in order to guide creation, provisioning, modification and deletion of instances.

In essence, your Gantree configuration represents your desired infrastructure.

When creating your own Gantree configuration, it's recommended to create it based on one of the samples provided.

If your configuration is invalid, Gantree will try it's best to help you identify where misconfiguration has occurred.

### Gantree Configuration Documentation

- [Basics](docs/gantree_config/basics.md)
- [Tutorial](docs/gantree_config/tutorial.md)
- [Samples](docs/gantree_config/samples.md)
- [Schema](docs/gantree_config/schema.md)
- [Limitations](docs/gantree_config/limitations.md)

## Library Usage

### Library Usage Documentation

- [Quick Start](docs/library/quick_start.md)
- [Limitations](docs/library/limitations.md)

***[!!!] Please note - Information below is likely outdated***
---

**Todo: info on special ssh-keygen steps**

<!-- #### Gantree configuration example

```json
{
  "metadata": {
    "project": "node-template", // project name
    "version": "0.0.1" // project version (not used right now)
  },
  "binary": {
    // "fetch" grabs a pre-compiled binary from a given URL
    "fetch": {
      "url": "https://substrate-node-bins.sgp1.digitaloceanspaces.com/node-template"
    },
    // we can also specify a repository if we want the nodes to compile the binary,
    // but note we can only have one of 'fetch' or 'repository'
    "repository": {
      "url": "https://github.com/substrate-developer-hub/substrate-node-template.git",
      "version": "HEAD" // or a commit hash
    },
    "filename": "node-template" // the name of the (compiled) binary
  },
  "nodes": [
    {
      "validator": true, // whether we should start this node with --validator
      "name": "gantree-nt-1", // node name for telemetry page
      "loggingFilter": "sync=trace,afg=trace,babe=debug", // OPTIONAL
      "telemetry": true, // OPTIONAL
      "chain": "dev", // OPTIONAL an argument to pass to --chain, leave
      "substrateOptions": [
        // OPTIONAL an array of extra options to pass to the substrate binary
      ],
      "rpcPort": 9933, // OPTIONAL specify a port for the RPC endpoint to bind to
      "instance": {
        "provider": "do", // or "aws" or "gcp"
        // machine slug for provider, check these out for
        // aws - https://aws.amazon.com/ec2/instance-types/
        // digitalocean - https://slugs.do-api.dev
        // gcp - https://cloud.google.com/compute/docs/machine-types
        "machineType": "s-1vcpu-1gb",
        // zone for provider
        // aws - https://docs.aws.amazon.com/general/latest/gr/rande.html
        // digitalocean - https://developers.digitalocean.com/documentation/v2/#list-all-regions
        // gcp - https://cloud.google.com/compute/docs/regions-zones#locations
        "zone": "nyc3",
        "sshUser": "root",
        "sshPublicKey": "ssh-rsa ..."
      }
    },
    // repeat as necessary for n nodes (you won't finalise blocks unless you have 2+)
    ...,
  ]
}
``` -->

<!-- ### Configuration File Strucutre: /binary

- "repository: [object] defines a git repository from which to compile the binary and deploy
    - "url": [string] a url to the git repository
    - "version": [string:HEAD] the commit/tag of the binary source to use
- "fetch": [object] defines a direct link to a binary to download and deploy
    - "url": [string] a url of the binary
- "filename": [string] the name of the binary when compiled, eg. 'polkadot', 'node-template', etc
- "localCompile": [string:false] should the binary be compiled on the host machine (if compiling), otherwise node[0] is used
- "useDefaultChainSpec": [string:false] should the binary run the internal spec, otherwise a custom spec is built
- "chain": [string:false] the chain argument to pass to the binary on execution
- "bootnodes": [array(string)] an array of bootnodes to pass to the binary

### Configuration File Structure: /nodes/[node]

- "name: [string] the name of the instance, otherwise (project-name + node-index) is used
- "binaryOptions": [object] configuration of various node specific binary arguments
- "instance": [object] configuration of the hardware/cloud instance to provision

### Configuration File Structure: /nodes/[node]/binaryOptions

- "telemetry: [string:false] a telemetry endpoint to pass to the binary
- "rpcPort": [integer:9933] the rpcPort to start the binary with
- "substrateOptions": [array(string)] misc arguments to pass to the binary

### Configuration File Structure: /nodes/[node]/instance [Amazon Web Services - EC2]
- "provider": [string] must = 'aws'
- "type" [string:m4.large] the type of the instance
- "volumeSize" [integer:50] the size of the main volume in gigabytes
- "region" [string:eu-central-1] the location of the instance
- "sshPublicKey": [string] the ssh public key to provide to the instance

### Configuration File Structure: /nodes/[node]/instance [Google Cloud Platform - GCE]
- "provider": [string] must = 'gcp'
- "type" [string:n1-standard-4] the type of the instance
- "sizeGb" [integer:50] the size of the main volume in gigabytes
- "zone" [string:eu-central-1] the location of the instance
- "sshPublicKey": [string] the ssh public key to provide to the instance

### Configuration File Structure: /nodes/[nodes]/instance [Digital Ocean]
- "provider": [string] must = 'do'
- "size" [string:s-1vcpu-1gb] the size of the droplet
- "region" [string:nyc3] the location of the droplet
- "sshPublicKey": [string] the ssh public key to provide to the droplet -->
