$VerbosePreference = "Continue";
Import-Module .\Zeusfile\Zeus.PowerShell.Zeusfile.psd1

$MyRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PluginsRoot = Convert-Path (Join-Path $MyRoot "..\..\..\..\plugins")
dir $PluginsRoot | foreach {
	$moduleDir = Join-Path $_.FullName "bin\Debug"
	$plugin = dir $moduleDir | where { $_.PSIsContainer } | select -first 1
	if(Test-Path "$moduleDir\$plugin") {
		Write-Verbose "Found $plugin Plugin in $moduleDir"
		$moduleDir = Convert-Path $moduleDir
		$env:PsModulePath = "$($env:PsModulePath);$moduleDir"
	}
}

function prompt() { 
	Write-Host (Get-Location)
	"zeusfile> " 
}