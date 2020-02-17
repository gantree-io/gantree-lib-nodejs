<!-- If you are seeing this, you may be reading an embedded version of this readme.md on BitBucket. If you see any other statements with arrows like this one, feel free to ignore them. BitBucket doesn't support comments like these. -->
<!-- markdownlint-disable MD001 MD041 -->
![Platform: Linux,Mac](https://img.shields.io/badge/Platform-%20Linux%20%7C%20Mac-blue.svg)
<!-- markdownlint-enable MD001 MD041 -->

# Gantree CLI

## About

Substrate is built on the core belief that the future will be multichain.

In the past, setting up and managing blockchain networks required an understanding of a multitude of concepts which may have inhibited end users from experimenting with them.

With the assistance of funding from the [Web3 Foundation](https://web3.foundation/), Flex Dapps is building a suite of technologies which will enable both power users and those less versed to create and manage substrate-powered parachain networks via rapid spin-up and tear-down of self-managed or cloud-hosted machines.

## Requirements

<!-- This repo has code for creating a complete implementation of the approach
described [here](https://hackmd.io/QSJlqjZpQBihEU_ojmtR8g) from scratch, including
both layers described in [Workflow](#workflow). This can be done on a host with
NodeJS, Yarn and Git installed with: -->

### Software Requirements

In order to use Gropius-CLI, the following dependencies are required:

| REQUIREMENT                    | VERSION   | NOTES                                          |
| ------------------------------ | --------- | ---------------------------------------------- |
| NodeJS                         | >=10.18.1 | Recommended install method: [nvm](nvm-install) |
| [Yarn](yarn-install)           | >=1.21.1  | Install with `npm install -g yarn`             |
| [Terraform](terraform-install) | >=0.12    | Snap package will be likely too old            |
| [Ansible](ansible-install)     | >=2.8     | Recommended install method: pip                |

[nvm-install]: https://github.com/nvm-sh/nvm
[yarn-install]: https://yarnpkg.com/lang/en/docs/install
[terraform-install]: https://www.terraform.io/downloads.html
[ansible-install]: https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html

### NodeJS/Ansible Requirements

In order to install the required node packages and ansible roles, run the following

```bash
git clone https://bitbucket.org/flexdapps/gantree-gropius
cd gantree-gropius
yarn
ansible-galaxy install -r ./ansible/requirements/requirements.yml
```

### Environment Requirements

#### Provider Credentials

For security reasons, credentials for infrastructure providers must be exported as environment variables.

| PROVIDER     | EXPORTS REQUIRED                                | NOTES                                                                                                                                                       |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS          | `AWS_ACCESS_KEY_ID`</br>`AWS_SECRET_ACCESS_KEY` | IAM account with EC2 and VPC write access.                                                                                                                  |
| GCP          | `GOOGLE_APPLICATION_CREDENTIALS`                | path to json file with credentials of the service account you want to use; this service account needs to have write access to compute and network resources |
| DigitalOcean | `DIGITALOCEAN_TOKEN`                            | A DigitalOcean access token with read + write access                                                                                                        |

**note:** you only need credentials for providers you wish to use

#### SSH Credentials

You need an additional environment variables to allow ansible to connect to created instances:

| EXPORT NAME            | DESCRIPTION                                                 |
| ---------------------- | ----------------------------------------------------------- |
| `SSH_ID_RSA_VALIDATOR` | path to private SSH key you want to use for the validators. |

<!-- | `SSH_ID_RSA_PUBLIC`    | path to private SSH key you want to use for the public nodes. | -->

You must generate this keypair yourself and add it to your ssh-agent.

<!-- You can easily create and add them to your ssh-agent as follows:

```bash
$ ssh-keygen -f <path>
$ ssh-add <path>
``` -->

#### Terraform Statefile Path (optional)

By default the terraform state is stored in:

`${os_home}/gantree-cli/build/terraform/state/`

This location can be customized with the following environment variable:

| EXPORT NAME                | DESCRIPTION                                         |
| -------------------------- | --------------------------------------------------- |
| `TERRAFORM_STATEFILE_PATH` | path where the terraform statefile will be located. |

Note: This path must be absolute. If it does not exist it will be created.

### Configuration Requirements

Gantree-CLI requires a configuration file (main.json) in order to guide creation, provisioning, modification and deletion of instances.

Using one of the examples below, create a configuration file to represent your desired infrastructure.

#### Configuration Samples

Examples of provider definitions

* [AWS Sample](config/main.sample_aws.json)
* [DigitalOcean Sample](config/main.sample_do.json)
* [GCP Sample](config/main.sample_gcp.json)

Multiple providers can be used in a single configuration.

* ***This is a work-in-progress and not yet officially supported***

**note:** the more distributed your public nodes, the lower the likelihood your network will be affected by issues/outages from respective cloud providers.

## Usage

### Syncronization

Before attempting to run sync, ensure all tasks outlined in [requirements](#requirements) have been completed.

* You've installed all requirements
* All relevant environment variables are exported
* You've nagivated to the root of the cloned repo

To synchronise your configuration with digital infrastructure, run the following:

```bash
node . sync --config <PATH_TO_GANTREE_CONFIG>
```

<!-- You can also just provision a set of previously created machines with the ansible code
[here](./ansible). We have provided an [example inventory](./ansible/inventory.sample)
that you can customize. -->

The `sync` command is idempotent, unless there are errors it will always have
the same results. You can execute it as much as you want, it will only make
changes when the actual infrastructure state doesn't match the desired state.

### Cleaning up

You can remove all the created infrastructure with:

```bash
node . clean -c config/main.json
```
