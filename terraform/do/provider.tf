# variable "digitalocean_ssh_fingerprint" {}
# variable "digitalocean_pub_key" {}
# variable "digitalocean_private_key" {}

provider "digitalocean" {
  # token   = "44166eb03ee15b7826ecdae4c2a729f905ea5e623cb78bf80a10e0d21187d757"
  # token   = "${digitalocean_token}"
  version = "~> 1.13"
}
