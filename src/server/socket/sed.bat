@echo off
setlocal enableextensions
set "search=const socketLink ="
set "textfile=..\..\main\scripts\client.js"
set "newfile=client.new.js"
for /f "usebackq" %%j in (`type link.txt`) do set "link=%%j"
(
  for /f "usebackq delims=" %%i in (`type %textfile%`) do (
    set "line=%%i"
    setlocal enabledelayedexpansion
    if "!line:~0,18!"=="%search%" (
        set "line=const socketLink = '%link%';"
    )
    echo(!line!
    endlocal
  )
)>"%newfile%"
move /y "%newfile%" "%textfile%" >nul
