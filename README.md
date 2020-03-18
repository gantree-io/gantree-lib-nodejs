# Gantree Lib

Library at the core of Gantree

***[!] Please note - This readme is outdated and requires updating***

## About


Substrate is built on the core belief that the future will be multichain.

In the past, setting up and managing blockchain networks required an understanding of a multitude of concepts which may have inhibited end users from experimenting with them.

With the assistance of funding from the [Web3 Foundation](https://web3.foundation/), Flex Dapps is building a suite of technologies which will enable both power users and those less versed to create and manage substrate-powered parachain networks via rapid spin-up and tear-down of self-managed or cloud-hosted machines.

## Software Requirements

If you would like to avoid having to install dependencies, use the [Docker image](https://github.com/flex-dapps/gantree-cli-docker).

Otherwise, in order to use gantree-cli, the following dependencies are required:

| REQUIREMENT                                                                                   | VERSION   | NOTES                                                            |
| --------------------------------------------------------------------------------------------- | --------- | ---------------------------------------------------------------- |
| NodeJS                                                                                        | >=10.15.2 | Recommended install method: [nvm](https://github.com/nvm-sh/nvm) |
| [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html) | >=2.9.4   | Recommended install method: pip                                  |
| Git                                                                                           | >=2.0     | Required by ansible-galaxy for installing role                   |

### Ansible Requirements

Install required ansible roles

```bash
curl https://raw.githubusercontent.com/flex-dapps/gantree-requirements/master/ansible-galaxy/requirements.yml > ansible_requirements.yml
ansible-galaxy install -r ansible_requirements.yml
```

Install required python packages (it is highly recommended to use a virtual environment)

```bash
pip install ansible boto boto3 botocore requests google-auth
```

### Package Installation

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
| GCP          | `GOOGLE_APPLICATION_CREDENTIALS`                | path to json file with credentials of the service account you want to use; this service account needs to have write access to compute and network resources |
| DigitalOcean | `DO_API_TOKEN`                                  | A DigitalOcean access token with read + write access                                                                                                        |

**note:** You only need credentials for providers you wish to use

### SSH Credentials

You must generate this keypair yourself and add it to your ssh-agent.

**note:** Don't forget to add the private key to you ssh-agent otherwise you will get **_Permission denied (publickey)_** during ansible tasks

## Configuration

Gantree-cli requires a configuration file (main.json) in order to guide creation, provisioning, modification and deletion of instances.

Using one of the examples below, create a configuration file to represent your desired infrastructure.

### Configuration File Samples

**note:** Due to issues between json/js/python/ansible boolean parsing, all boolean values should be supplied as lowercase strings, eg. "true" or "false". We hope to improve this in a future version of gantree-cli

Examples of provider definitions

- [AWS Sample](samples/config/only_aws.sample.json)
- [DigitalOcean Sample](samples/config/only_do.sample.json)
- [GCP Sample](samples/config/only_gcp.sample.json)

### Configuration File Structure: Top Level

- "project": [string] the gantree project name
- "binary": [object] options relating to the substrate binary to be deployed
- "nodes": [array(object)] a list of node configurations which will become deployed instances

### Configuration File Strucutre: /binary

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
- "sshPublicKey": [string] the ssh public key to provide to the droplet

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
```

## Known Limitations

### Ssh Keys

Currently gantree-cli uses ssh-agent which iterates over aviailable ssh keys to connect to machines for provisioning. Machines will often reject connections after a few incorrect keys and so there's a practical limit to this approach of around 5 keys in the agent at a time. We're expecting to have a more robust approach to this that allows unlimited keys in a near release.
