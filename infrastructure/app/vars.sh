#!/bin/sh
echo "
repo_url=\"$AWS_ECR_ACCOUNT_URL/poker_app\"
atlas_org_id=\"$ATLAS_ORG_ID\"
db_admin_email=\"$ATLAS_DB_EMAIL\"
db_admin_password=\"$ATLAS_DB_PASSWORD\"
db_app_username=\"$ATLAS_APP_USERNAME\"
db_app_password=\"$ATLAS_APP_PASSWORD\"
"
