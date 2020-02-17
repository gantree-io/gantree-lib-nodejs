variable "digitalocean_token" {
  default = ""
}

variable "digitalocean_pub_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC1V1uZljqfj0TQ9FkNFzSN/J78Zy7bm3acbBt4G/yizhSB7F6SwvGcZvCB98jgZ8zsBLTANXjJufTYmTkEUWLaSis2TrVtuAP6MrrHBeE4zsrGf25CTgt5GtG+QOkBzJ6dBIBCiJlz9x0lvaWLjgBBfJSCduxvyshsRVd7+9l1/HxVgnJhdmrZ2v5z3RY6USsN/YMS8wrhts8yjfDNdG6zue3oGow8wsNWTo/1V8J44wdyNu1IXqWN4JsceG+phpurMHWFb+oBizl4YgmO6fmeB7BlYHM9uIuILPDSkwvkWXL0MWnDitxzrKfEcDVSM/9lKVVnF1kOoO1BOUoT6DuD devops@flexdapps.com"
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

variable "public_key" {
  default = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDqaZLcaObIN87RVHf+eI+TvXEAyFe9hCDBnJFohM0KYZYgqfihpyBgwCzF1RzC2w1/+ypwZ4Lv8CNnFp22C2p03ANoeXfoJS3jPDeIr6a1PvzH9qPx+zNc6kEW5aD8oA2KuJB1+plPZ881toW2WBk6Y0n5vI3CEo2UFiXjWC4uCsMhvhmhOXtQiXlEOgighkE3jZqiPUQduJ+FPl5rqCd+yMVpSTOYR5/cOCmhfLv2ogyBkxQV7cAKJZqIVKG3XK8axXHHrIx5gBMAT3HDYWg20S8gffZhEK1a7iLhzGYznCG2C+V72msUFjWyOSTw/vaaBr4cy9rAi0lkajgcfi+n devops@web3.foundation"
}

variable "ssh_user" {
  default = ""
}

