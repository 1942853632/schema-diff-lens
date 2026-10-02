$ErrorActionPreference = 'Stop'
$repo = 'https://github.com/1942853632/schema-diff-lens.git'
git config --local http.sslbackend openssl
git config --local --unset-all credential.helper 2>$null
git config --local --add credential.helper ''
git config --local --add credential.helper '!gh auth git-credential'
$env:GH_CONFIG_DIR = (Join-Path $PSScriptRoot '.gh')
git push -u origin main
