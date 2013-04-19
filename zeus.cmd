@echo off
if exist %~dp0src\Zeus\bin\Debug\Zeus.exe goto run
echo "Zeus has not been built yet!"
exit /B 1
:run
%~dp0src\Zeus\bin\Debug\Zeus.exe %*