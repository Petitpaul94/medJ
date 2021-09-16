start /d C:\Users\icoeu\OneDrive\Documents\Programmation\nodejs\bradbury /i node index.js

:loop

set /p cours=entrez le nom du cours : 
echo %cours%
start curl.exe http://localhost:8080 -d "%cours%"
goto loop