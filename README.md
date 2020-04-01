Library at the core of Gantree

# Gantree Library

- [Gantree Library](#gantree-library)
  - [About](#about)
  - [Docker Image](#docker-image)
  - [Requirements](#requirements)
    - [1 - Application Requirements](#1---application-requirements)
    - [2 - Ansible Requirements](#2---ansible-requirements)
    - [3 - Python Requirements](#3---python-requirements)
    - [4 - Package Installation](#4---package-installation)
    - [5 - Environment Requirements](#5---environment-requirements)
      - [Provider Credentials](#provider-credentials)
      - [SSH Credentials](#ssh-credentials)
  - [Gantree Configuration](#gantree-configuration)
  - [Library Usage](#library-usage)
  - [CLI Usage](#cli-usage)

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

### 5 - Environment Requirements

#### Provider Credentials

For security reasons, credentials for infrastructure providers must be exported as environment variables.

| PROVIDER     | EXPORTS REQUIRED                                | NOTES                                                                                                                                                       |
| ------------ | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS          | `AWS_ACCESS_KEY_ID`</br>`AWS_SECRET_ACCESS_KEY` | IAM account with EC2 and VPC write access.                                                                                                                  |
| GCP          | `GCP_SERVICE_ACCOUNT_FILE`                      | path to json file with credentials of the service account you want to use; this service account needs to have write access to compute and network resources |
| DigitalOcean | `DO_API_TOKEN`                                  | A DigitalOcean access token with read + write access                                                                                                        |

<p><img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_related_note_tag.png" alt="Related note tag" width="100">
You only need credentials for providers you wish to use
</p>

#### SSH Credentials

SSH private key can be defined using environment variable references in your Gantree configuration.

<p><img src="https://raw.githubusercontent.com/flex-dapps/gantree-misc/master/docs/img/Github_related_note_tag.png" alt="Related note tag" width="100">
Important: Key pairs must be PEM.
</p>

## Gantree Configuration

Gantree requires a configuration file (Gantree configuration) in order to guide creation, provisioning, modification and deletion of instances.

In essence, your Gantree configuration represents your desired infrastructure.

When creating your own Gantree configuration, it's recommended to create it based on one of the samples provided.

If your configuration is invalid, Gantree will try it's best to help you identify where misconfiguration has occurred.

Once you're ready to create your own Gantree configuration, please consult the links below.

- [Basics](docs/gantree_config/basics.md)
- [Tutorial](docs/gantree_config/tutorial.md)
- [Samples](docs/gantree_config/samples.md)
- [Schema](docs/gantree_config/schema.md)
- [Limitations](docs/gantree_config/limitations.md)

## Library Usage

- [Gantree](docs/_generated/gantree.md) - _generated_
- [Quick Start](docs/library/quick_start.md)
- [Limitations](docs/library/limitations.md)

## CLI Usage

A CLI is available for gantree-lib as a separate package.

Please see [gantree-cli](https://github.com/flex-dapps/gantree-cli) for information
