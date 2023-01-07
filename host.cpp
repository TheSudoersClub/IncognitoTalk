#include <cstdlib>
#include <iostream>
#include <ctype.h>
#include <unistd.h>

int main()
{
    char choice;

#ifdef __linux__
    // installing dependency
    if (system("if ! command -v bore >/dev/null 2>&1; then echo Dependency bore is not installed.; fi") == 1)
    {
        std::cout << "Install? [Y/n] : ";
        std::cin >> choice;
        choice = toupper(choice);

        if (choice == 'Y')
        {
            system("curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs/ | sh");
            system("sudo apt install cargo");
            system("reset");
            system("cargo install bore-cli");
        }
        else
            exit(1);
    }
    // creating server
    system("pkill server");
    system("bore local 55555 --to bore.pub > dist/.resources/log.txt & sleep 5; echo $(cat dist/.resources/log.txt) | grep -o -P 'bore.pub.{0,6}' > dist/.resources/link.txt");

    std::cout << "\nServer is up...\n";

    system("echo $(cat dist/.resources/link.txt | grep -o -P ':.{0,6}') > dist/.resources/link.txt");
    std::cout << "\n";

    // changing port inside the client.js file /src/scripts/server/server.js
    sleep(5);
    system("sed -i \"s/bore.pub:\\(.\\{5\\}\\)/bore.pub$(cat dist/.resources/link.txt)/\" src/scripts/client.js"); // karle jugad karle karle koi jugad

    // creating a server with python to host the application
    system("pkill python3");
    system("python3 -m http.server 7777 --directory src/ &");
    system("bore local 7777 --to bore.pub > dist/.resources/log.txt & sleep 5; echo $(cat dist/.resources/log.txt) | grep -o -P 'bore.pub.{0,6}' > dist/.resources/link.txt");

    system("echo Invite Link: http://$(cat dist/.resources/link.txt)");
    std::cout << "\n";
    // executing the compiled file  | using pgk (npm install pkg) | pkg /src/scripts/server/server.js
    system("chmod +x dist/linux/server && dist/linux/server");

#endif
}