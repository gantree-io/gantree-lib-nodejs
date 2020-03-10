if [ "$1" = "-v" ]
then
    ansible-playbook -i ./inventory ansible/infra_and_operation.yml -vvvv
else
    ansible-playbook -i ./inventory ansible/infra_and_operation.yml
fi
