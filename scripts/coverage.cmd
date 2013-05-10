@echo off

pushd %~dp0..\zeus

if not exist "%~dp0..\build" mkdir "%~dp0..\build"
if exist "%~dp0..\build\coverage.html" del "%~dp0..\build\coverage.html"

jscoverage --no-highlight lib lib-cov

setlocal
set ZEUS_COV=1
mocha spec -R html-cov > "%~dp0..\build\coverage.html"
endlocal

popd
