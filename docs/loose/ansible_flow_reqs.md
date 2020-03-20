

## Environemnt
#### AWS
- AWS_ACCESS_KEY
- AWS_SECRET_KEY

#### GCP
- GCP_AUTH_KIND=serviceaccount
- GCP_GCP_SERVICE_ACCOUNT_FILE

#### DO
- DO_API_TOKEN

## Python
- must run python3

### Pip Packages
#### AWS
- boto
- boto3
- botocore

#### GCP
- requests
- google_auth

## Notes
AWS will leave instances hanging around for many minutes after terminating them
To avoid this our roles will remove the not_terminated tag on instances when terminating them
If you manually terminate an aws instance, you should delete this tag so that the roles ignore them
