terraform {
  backend "local" {
    path = "{{ dir }}/tfstate"
  }
}
