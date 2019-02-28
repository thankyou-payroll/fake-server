# fake-server

Dockerized Fake server toolkit for development and testing

# Environmental Variables (Defaults)

```
REST_API_PATH = "/api",
MULTI_PART_PATH = "/upload",
WEB_SOCKET_PATH = "/ws"
```

# Usage

Create `./__mocks__/config.yml`

```yml
rest:
  - path: /login
    method: post
    validate:
      body:
        email: "test@test.com"
        password: "my-password"
    success: login.success
    error: 401.error
  - path: /users
    success: users.success
    error: 401.error
    validate:
      queryString:
        token: my-secret
multiPart:
  - name: "avatar"
    maxCount: 1
  - name: "gallery"
    maxCount: 8
```

## `rest`

### Properties

_path_: Endpoint you want to mock
_method_: HTTP Method
_validate_: (Optional)

    _body_: Object with values to validate for success
    _queryString_: Object with values to validate for success

_success_: Name of the yaml file that has the blueprint for the success payload
_error_: Name of the yaml file that has the blueprint for the error payload

## `multiPart`

### Properties

_name_: `name` of your InputFile
_maxCount_: Max amount of files allowed on the queue

# Using with Docker

```yml
version: "3"
services:
  app:
    build: .
    ports:
      - 80:80
    environment:
      - API_URL=http://localhost:3000/my-rest-api
  fake-server:
    image: thankyoupayroll/fake-server
    environment:
      - REST_API_PATH=/my-rest-api
    ports:
      - 3000:3000
    volumes:
      - "./__mocks__/:/workspace/responses"
```

# TODO

- [x] REST
- [x] MultiPart Upload (Experimental)
- [ ] Stream
- [ ] WebSocket
- [ ] GraphQL
