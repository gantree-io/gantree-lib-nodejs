terraform {
  backend "local" {
    path = "{{ tfstateDir }}/tfstate"
  }
}
