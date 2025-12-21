variable "my_ip_cidr" {
  description = "Your public IP in CIDR format, e.g. 1.2.3.4/32"
  type        = string
}

variable "key_name" {
  description = "Existing EC2 Key Pair name (created in AWS Console)"
  type        = string
}

