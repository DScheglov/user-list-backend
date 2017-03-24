PROJECT := dsch-user-list-api
IMAGE := dscheglov/user-list-api
PORT_MAP := 8800:8888

drop:
	docker rm -f $(PROJECT)

clean: drop
	docker rmi -f $(IMAGE)

build:
	docker build -t $(IMAGE) .

run:
	docker run -d --name=$(PROJECT) -p $(PORT_MAP) $(IMAGE)

up: build run
