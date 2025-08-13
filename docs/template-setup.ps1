#!/usr/bin/env pwsh
[CmdletBinding()]
param(
    [Parameter()][string]$projectDir = $PSScriptRoot
)

Write-Host "Template Setup Completed!" -ForegroundColor Green