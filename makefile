main: create-build-directory home-server socket-server port-forwarding-service main-app compile-home-app 

create-build-directory:
	mkdir -p build/ build/home/ build/home/inct-app-linux-x64 build/home/inct-app-win32-x64 build/main/ build/server/ build/server/chat/ build/server/socket/ build/server/home/ build/server/port-forwarding-service/

home-server:
	pkg src/server/home/home-server.js && mv home-server-* build/server/home/ 

socket-server:
	pkg src/server/socket/socket-server.js && mv socket-server-* build/server/socket/ && pkg src/server/socket/forward-socket-server.js && mv forward-socket-server-* build/server/socket/ && pkg src/server/socket/handleKey.js && mv handleKey-* build/server/socket/

port-forwarding-service:
	cp -rf src/server/port-forwarding-service/ build/server/

main-app:
	cp -rf src/main/ build/

compile-home-app:

	# linux
	electron-packager src/home/ inct-app --platform=linux --arch=x64 --icon=src/home/assets/logo.ico
	rm -r build/home/inct-app-linux-x64/
	mv inct-app-linux-x64/ build/home/

	# windows
	electron-packager src/home/ inct-app --platform=win32 --arch=x64 --icon=src/home/assets/logo.ico
	rm -r build/home/inct-app-win32-x64/
	mv inct-app-win32-x64/ build/home/

