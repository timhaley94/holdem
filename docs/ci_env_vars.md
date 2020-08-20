## CI env vars

To set up your own CI pipeline for this repository, you will need
a context called `AWS Prod` with these parameters:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_DEFAULT_REGION`
- `AWS_ECR_ACCOUNT_URL`	

`AWS_REGION` and `AWS_DEFAULT_REGION` can (and probably should) be
the same value. Everything other than `AWS_ECR_ACCOUNT_URL`	should
be self evident.

`AWS_ECR_ACCOUNT_URL`	will be `<<account id>>.dkr.ecr.<<region>>.amazonaws.com`.