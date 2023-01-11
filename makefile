main:create-build-directory chat-server home-server socket-server compile-home-app main-app

create-build-directory:
	mkdir -p build/ build/home/ build/main/ build/server/ build/server/chat/ build/server/socket/ build/server/home/ build/server/port-forwarding-service/

chat-server:
	pkg src/server/chat/chat-server.js && mv chat-server-* build/server/chat/ && pkg src/server/chat/forward-chat-server.js && mv forward-chat-server-* build/server/chat/

home-server:
	pkg src/server/home/home-server.js && mv home-server-* build/server/home/ 

socket-server:
	pkg src/server/socket/socket-server.js && mv socket-server-* build/server/socket/ && pkg src/server/socket/forward-socket-server.js && mv forward-socket-server-* build/server/socket/

main-app:
	cp -rf src/main/ build/

compile-home-app:
	cp -rf src/server/port-forwarding-service/ build/server/
	electron-packager src/home/ inct-app --platform=linux --arch=x64
	rm -r build/home/inct-app-linux-x64/*
	mv inct-app-linux-x64/ build/home/
