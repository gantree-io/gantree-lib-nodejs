# Gantree Configuration - Samples

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/04/14   |

- [Gantree Configuration - Samples](#gantree-configuration---samples)
  - [Binary Methods](#binary-methods)
  - [Permutations](#permutations)

## Binary Methods

Gantree supports multiple methods of deploying nodes among providers.

These methods are:

| METHOD NAME/KEY | DESCRIPTION                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Repository      | Download and compile a substrate node from the specified repository, optionally specifying a specific version as a commit hash or tag. |
| Fetch           | Download a binary from the specified url.                                                                                              |
| Preset          | Specify a preset with repository/fetch fields already defined.                                                                         |

Supported presets can be found [here](../../src/static_data/binary_presets.json).

## Permutations

| Provider/s   | Preset                                                                                         | Repository                                                                                 | Fetch                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| AWS          | [Polkadot 0.7.22 (Kusama) - Fetch](../../samples/config/preset/polkadot_aws.sample.json)       | [Polkadot HEAD](../../samples/config/repository/polkadot_aws.sample.json)                  | [Polkadot 0.7.22 (Kusama)](../../samples/config/fetch/polkadot_aws.sample.json) |
| DigitalOcean | [Polkadot 0.7.22 (Kusama) - Fetch](../../samples/config/preset/polkadot_do.sample.json)        | [Polkadot HEAD](../../samples/config/repository/polkadot_do.sample.json)                   | [Polkadot 0.7.22 (Kusama)](../../samples/config/fetch/polkadot_do.sample.json)  |
| GCP          | [Polkadot 0.7.22 (Kusama) - Fetch](../../samples/config/preset/polkadot_gcp.sample.json)       | [Polkadot HEAD](../../samples/config/repository/polkadot_gcp.sample.json)                  | [Polkadot 0.7.22 (Kusama)](../../samples/config/fetch/polkadot_gcp.sample.json) |
| DigitalOcean | [Polkadot 0.7.28 (Westend) - Fetch](../../samples/config/preset/westend_0.7.28_do.sample.json) | [Polkadot master (Westend)](../../samples/config/repository/westend_master_do.sample.json) |
| DigitalOcean | [Polkadot master (Westend) - Build](../../samples/config/preset/westend_master_do.sample.json) |
