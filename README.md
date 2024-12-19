## Algoritmo implementado

```mermaid
stateDiagram-v2
direction LR

state "REST API Request" as rest_api
state "Upload do arquivo" as upload_csv
state "Registrar arquivo no banco de dados" as register_csv_database
state "Processar CSV" as parse_csv

[*] --> rest_api
rest_api --> upload_csv
upload_csv --> register_csv_database
register_csv_database --> parse_csv
parse_csv --> each_transaction
state "Para cada transação" as each_transaction {
    state "Transação duplicada?" as is_duplicated
    [*] --> is_duplicated
    state if_duplicated_state <<choice>>
    is_duplicated --> if_duplicated_state
    state "Insere no banco como duplicada" as duplicated_database
    state "Adiciona a informação na resposta da API" as duplicated_response
    if_duplicated_state --> duplicated_database: Sim
    duplicated_database --> duplicated_response
    state if_negative_state <<choice>>
    state "Transação com valor negativo?" as is_negative
    is_negative --> if_negative_state
    if_duplicated_state --> is_negative: Não
    state "Adiciona a informação na resposta da API" as negative_response
    state "Insere no banco como negativo" as negative_database
    if_negative_state --> negative_database: Sim
    negative_database --> negative_response
    state if_max_value_state <<choice>>
    state "Transação acima do valor máximo?" as is_max_value
    if_negative_state --> is_max_value: Não
    is_max_value --> if_max_value_state
    state "Adiciona flag de valor" as add_max_value_flag
    if_max_value_state --> add_max_value_flag: Sim
    state "Insere no banco" as valid_transaction_database
    if_max_value_state --> valid_transaction_database: Não
    add_max_value_flag --> valid_transaction_database
    valid_transaction_database --> [*]
    negative_response --> [*]
    duplicated_response --> [*]

}
state "Marca o CSV como processado no banco de dados" as update_csv_database
each_transaction --> update_csv_database
state "REST API Response" as api_response
update_csv_database --> api_response
api_response --> [*]
```

## Database

Para iniciar o banco de dados:

```sh
docker compose up -d
```

Todas as credenciais se encontram no arquivo `.env` na raíz do projeto. A estrutura do banco será criada automaticamente.

## Executar

```sh
npm run start
```

A API será exposta na porta 3000 fornecendo o endpoin `POST /upload` que recebe o arquivo no campo `file`.

Um arquivo `.csv` modelo está disponível em `/test/model.csv`.
