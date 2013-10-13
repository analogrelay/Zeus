Import-Module .\Zeus.psd1
$path = "..\..\..\sample"
if(!(Test-Path $path)) {
	mkdir $path | Out-Null
}
cd $path