# Gantree Configuration - Limitations

**_Documentation still in development_**

**Document information**

| GANTREE CONFIG VERSION | LAST UPDATED |
| ---------------------- | ------------ |
| 2.0                    | 2020/04/02   |

- [Gantree Configuration - Limitations](#gantree-configuration---limitations)
  - [Nodes](#nodes)
    - [Key Repetition](#key-repetition)

## Nodes

### Key Repetition

Objects in the node array suffer from repetition for some keys (e.g. sshPrivateKeyPath is a required key for all nodes, but it's value is unlikely to differ between nodes). A method of defaulting the value of these keys will be supported in a future release.
