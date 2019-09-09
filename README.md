### Installation

Edit env.example and copy it to .env

Start webpack server inside docker

`docker-compose up`

Open browser: http://localhost

### Testing

`docker exec -it geneplanet_webpack jest --env=jsdom --watchAll --coverage`
