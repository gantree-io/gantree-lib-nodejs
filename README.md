# Gantree CLI

## About

Substrate is built on the core belief that the future will be multichain.

In the past, setting up and managing blockchain networks required an understanding of a multitude of concepts which may have inhibited end users from experimenting with them.

With the assistance of funding from the [Web3 Foundation](https://web3.foundation/), Flex Dapps is building a suite of technologies which will enable both power users and those less versed to create and manage substrate-powered parachain networks via rapid spin-up and tear-down of self-managed or cloud-hosted machines.

## Software Requirements

If you would like to avoid having to install dependencies, use the [Docker image](https://github.com/flex-dapps/gantree-cli-docker).

Otherwise, in order to use gantree-cli, the following dependencies are required:

| REQUIREMENT                    | VERSION   | NOTES                                          |
| ------------------------------ | --------- | ---------------------------------------------- |
| NodeJS                         | >=10.15.2 | Recommended install method: [nvm](nvm-install) |
| [Terraform](terraform-install) | >=0.12.20 | Snap package will be likely too old            |
| [Ansible](ansible-install)     | >=2.9.4   | Recommended install method: pip                |

[nvm-install]: https://github.com/nvm-sh/nvm
[yarn-install]: https://yarnpkg.com/lang/en/docs/install
[terraform-install]: https://www.terraform.io/downloads.html
[ansible-install]: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html

### Ansible Requirements

Install required ansible roles

```bash
curl https://raw.githubusercontent.com/flex-dapps/gantree-requirements/master/ansible-galaxy/requirements.yml > ansible_requirements.yml
ansible-galaxy install -r ansible_requirements.yml
```

### Package Installation

Install gantree-cli

```bash
npm install @flexdapps/gantree-cli -g
```

## Environment Requirements

### Provider Credentials

For security reasons, credentials for infrastructure providers must be exported as environment variables.

| PROVIDER     | EXPORTS REQUIRED                                | NOTES                                                                                                                                                       |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS          | `AWS_ACCESS_KEY_ID`</br>`AWS_SECRET_ACCESS_KEY` | IAM account with EC2 and VPC write access.                                                                                                                  |
| GCP          | `GOOGLE_APPLICATION_CREDENTIALS`                | path to json file with credentials of the service account you want to use; this service account needs to have write access to compute and network resources |
| DigitalOcean | `DIGITALOCEAN_TOKEN`                            | A DigitalOcean access token with read + write access                                                                                                        |

**note:** You only need credentials for providers you wish to use

### SSH Credentials

You need an additional environment variables to allow ansible to connect to created instances:

| EXPORT NAME            | DESCRIPTION                                                |
| ---------------------- | ---------------------------------------------------------- |
| `SSH_ID_RSA_VALIDATOR` | path to private SSH key you want to use for the validators |

You must generate this keypair yourself and add it to your ssh-agent.

**note:** Don't forget to add the private key to you ssh-agent otherwise you will get **_Permission denied (publickey)_** during ansible tasks

## Configuration

Gantree-cli requires a configuration file (main.json) in order to guide creation, provisioning, modification and deletion of instances.

Using one of the examples below, create a configuration file to represent your desired infrastructure.

### Configuration File Samples

Examples of provider definitions

- [AWS Sample](samples/config/only_aws.sample.json)
- [DigitalOcean Sample](samples/config/only_do.sample.json)
- [GCP Sample](samples/config/only_gcp.sample.json)

**note:** Multiple providers cannot yet be used in a single configuration. This is planned for a future release.

### Configuration File Structure: Top Level

- "project": [string] the gantree project name
- "repository": [object] relating to the substrate binary to be deployed
- "validators": [object] defining the validators to deploy

### Configuration File Strucutre: repository

- "url": [string] the path to a git repository of the binary source to deploy
- "version": [string:HEAD] the commit/tag of the binary source to use
- "binaryName": [string] the name of the binary when compiled, eg. 'polkadot' or 'node-template'

### Configuration File Structure: validators

- "chain": [string] the name of the chain
- "useDefaultChainspec": [bool:false] use the internal rust chainspec of the compiled binary
- "telemetry": [boolean] whether to use the default telemetry, or not report any telemetry
- "loggingFilter": [string] the logging filter passed to the binary on running
- "nodes": [array] a list of cloud provider configurations which each map to a network instance

### Configuration File Structure: node

See samples/config folder

## Optional Configuration

### Environment Options

#### Terraform Statefile Path (optional)

By default the terraform state is stored in `<HOME-DIR>/gantree-cli/build/terraform/state/`

On the machine executing gantree-cli, HOME-DIR will resolve to the following:

| OS        | HOME-DIR                                           |
| --------- | -------------------------------------------------- |
| Linux     | `/home/<myusername>/`                              |
| Macintosh | `/Users/<myusername>/Library/Application Support/` |

This location can be customized with the following environment variable:

| EXPORT NAME                | DESCRIPTION                 |
| -------------------------- | --------------------------- |
| `TERRAFORM_STATEFILE_PATH` | path to terraform statefile |

**note:** This path must be absolute. If the statefile does not exist at this location it will be created.

## Usage

### Synchronisation

Before attempting to run sync, ensure all tasks outlined in [requirements](#requirements) have been completed.

- You've installed all requirements
- All relevant environment variables are exported
- You've nagivated to the root of the cloned repo

To synchronise your configuration with digital infrastructure, run the following:

```bash
gantree-cli sync --config <PATH_TO_GANTREE_CONFIG>
```

The `sync` command is idempotent, unless there are errors it will always have
the same results. You can execute it as much as you want, it will only make
changes when the actual infrastructure state doesn't match the desired state.

### Cleaning up

You can remove all the created infrastructure with:

```bash
gantree-cli sync clean -c config/main.json
```
