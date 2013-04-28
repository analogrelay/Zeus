@echo off
setlocal
set ZEUS_DEBUG=1
node debug "%~dp0zeus-cli\bin\zeus.js" %*