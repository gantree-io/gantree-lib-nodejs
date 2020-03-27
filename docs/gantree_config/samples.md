# Gantree Configuration - Samples

Gantree supports multiple methods of deploying nodes among providers.

These methods are:

| METHOD NAME/KEY | DESCRIPTION                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Repository      | Download and compile a substrate node from the specified repository, optionally specifying a specific version as a commit hash or tag. |
| Fetch           | Download a binary from the specified url.                                                                                              |
| Local           | Specify the path to a local binary (not yet supported).                                                                                |
| Preset          | Specify a preset with repository/fetch fields already defined.                                                                         |

Supported presets can be found [here](src/static_data/binary_presets.json).

## Permutations

| Provider/s   | Preset                                                                      | Repository                                                            | Fetch                                                              | Local |
| ------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ | ----- |
| AWS          | [Polkadot (Kusama) - Fetch](samples/config/preset/polkadot_aws.sample.json) | [Polkadot - HEAD](samples/config/repository/polkadot_aws.sample.json) | [Polkadot (Kusama)](samples/config/fetch/polkadot_aws.sample.json) | -     |
| DigitalOcean | [Polkadot (Kusama) - Fetch](samples/config/preset/polkadot_do.sample.json)  | [Polkadot - HEAD](samples/config/repository/polkadot_do.sample.json)  | [Polkadot (Kusama)](samples/config/fetch/polkadot_do.sample.json)  | -     |
| GCP          | [Polkadot (Kusama) - Fetch](samples/config/preset/polkadot_gcp.sample.json) | [Polkadot - HEAD](samples/config/repository/polkadot_gcp.sample.json) | [Polkadot (Kusama)](samples/config/fetch/polkadot_gcp.sample.json) | -     |

**note:** 'Local' method is not yet supported
