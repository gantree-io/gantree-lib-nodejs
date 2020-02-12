# variable "digitalocean_token" {}
# variable "digitalocean_ssh_fingerprint" {}
# variable "digitalocean_pub_key" {}
# variable "digitalocean_private_key" {}

provider "digitalocean" {
  token   = "bd530a909cb3f92f28fbf7012c11356990e371c0c5872ef50ecc0bb3fd2da806"
  version = "~> 1.13"
}
