
Install using Docker
-----------------------

1. Install docker
2. `docker build -t admin.empatkali.co.id:dev .`
3. `docker run -v ${PWD}:/app -v /app/node_modules -p 8081:8080 --rm admin.empatkali.co.id:dev`
4. Run `localhost:8081`

