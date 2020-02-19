variable "digitalocean_token" {
  default = ""
}

# in order of vars in main.tf
variable "node_count" {
  default = 2
}

variable "name" {
  default = "node"
}

variable "machine_type" {
  default = "s-16vcpu-64gb"
  # default = "s-1vcpu-1gb"
}

variable "zone" {
  default = "nyc3"
}

variable "ssh_user" {
  default = ""
}

variable "public_key" {
  default = ""
}
