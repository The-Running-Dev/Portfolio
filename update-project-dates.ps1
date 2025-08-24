function Update-ProjectDates {
    param(
        [PSCustomObject]$project
    )

    $lines = Get-Content $project.File
    $newLines = @()
    $i = 0

    $projectLine = "- **[$($project.Name)]($($project.Url))**"
    # Format the updated date as 'Month D, YYYY @ HH:mm'
    $updatedFormatted = (Get-Date $project.Updated -Format 'MMMM d, yyyy @ HH:mm')
    $dateLine = "  **Updated**: $updatedFormatted  "
    $projectLinePattern = "^- \\*\\*\\[\$([regex]::Escape($project.Name))\\]\\(\$([regex]::Escape($project.Url))\\)\\*\\*\\s*  *$"
    $dateLinePattern = '^[ ]*\\*\\*Updated\\*\\*:.*?\\s*  *$'

    while ($i -lt $lines.Count) {
        $line = $lines[$i]

        if ($line -match $projectLinePattern) {
            # Add the project line
            $newLines += $line
            $i++

            # Check if the next line is a date line (with possible trailing spaces)
            if ($i -lt $lines.Count -and $lines[$i] -match $dateLinePattern) {
                # Replace existing date line
                $newLines += $dateLine
                $i++
            } else {
                # Insert date line
                $newLines += $dateLine
            }

            # Skip malformed/bare date lines and any old Created/Updated lines
            while ($i -lt $lines.Count -and ($lines[$i] -match 'Created:' -or $lines[$i] -match 'Updated:' -or $lines[$i] -match '^[ ]*\d{4}-\d{2}-\d{2}.*\d{2}:\d{2}:\d{2}')) {
                $i++
            }

            # Add description lines (indented lines following the date)
            while ($i -lt $lines.Count -and $lines[$i] -match '^[ ]{2,}\S') {
                $newLines += $lines[$i]
                $i++
            }

            continue
        }

        # For all other lines, just keep them
        $newLines += $line
        $i++
    }

    Set-Content -Path $project.File -Value $newLines
}


function Get-AllProjects {
    param(
        [string]$docsPath = "web/docs"
    )
    # Only match lines like: - **[ProjectName](URL)**
    $projectRegex = '^- \*\*\[([^\]]+)\]\(([^\)]+)\)\*\*'
    $projects = @()

    Get-ChildItem -Path $docsPath -Recurse -Include *.md | ForEach-Object {
        $lines = Get-Content $_.FullName

        foreach ($line in $lines) {
            $match = [regex]::Match($line, $projectRegex)

            if ($match.Success) {
                $url = $match.Groups[2].Value

                if ($url -match 'the-running-dev') {
                    $projects += [PSCustomObject]@{
                        Name = $match.Groups[1].Value
                        Url  = $url
                        File = $_.FullName
                    }
                }               
            }
        }
    }

    return $projects
}

function Get-ProjectMetadata {
    param(
        [string]$url
    )

    $dates = Get-GitDates $url

    return [PSCustomObject]@{
        Added = $dates.Added
        Updated = $dates.Updated
    }
}

function Get-GitDates {
    param($repoUrl)
    $match = [regex]::Match($repoUrl, 'github.com[/:]([\w-]+/[\w.-]+)')
    
    if (-not $match.Success) {
        return @{ Added=''; Updated='' }
    }
    
    $repo = $match.Groups[1].Value
    
    try {
        $api = "https://api.github.com/repos/$repo/commits"

        $headers = @{ Authorization = "token ${env:GITHUB_TOKEN}" }
        $first = [datetime](Invoke-RestMethod -Headers $headers ($api + "?per_page=1&order=asc"))[0].commit.author.date
        $last = [datetime](Invoke-RestMethod -Headers $headers ($api + "?per_page=1"))[0].commit.author.date
    
        return @{ Added=($first.ToUniversalTime()); Updated=($last.ToUniversalTime()) }
    } catch {
        write-host "Error Getting Dates, ${repoUrl}: $_"

        return @{ Added=''; Updated='' }
    }
}

Get-AllProjects | ForEach-Object {
    $metaData = Get-ProjectMetadata -url $_.Url

    $project = [PSCustomObject]@{
        Name = $_.Name
        Url  = $_.Url
        File = $_.File
        Added = $metaData.Added
        Updated = $metaData.Updated
    }

    Update-ProjectDates $project
}