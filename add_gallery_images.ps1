# ============================================================
# Gallery Images Copy & Database Update Script
# Payal Foundation - नवीन Gallery Images Add करणे
# ============================================================

$publicFolder = "C:\Users\vedga\OneDrive\Desktop\samajseva\frontend\public"
$dbPath = "C:\Users\vedga\OneDrive\Desktop\samajseva\backend\samajseva.db"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Payal Foundation - Gallery Image Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "तुमच्या WhatsApp मधून 4 images निवडा." -ForegroundColor Yellow
Write-Host "File Explorer उघडला जाईल - त्यातून images select करा." -ForegroundColor Yellow
Write-Host ""

# Load Windows Forms for file dialog
Add-Type -AssemblyName System.Windows.Forms

$imageNames = @(
    @{ file = "gallery_new_1.jpg"; title = "Child Care & Home Visit"; title_mr = "बालसेवा व घरभेट उपक्रम"; category = "Child Welfare"; category_mr = "बाल कल्याण" },
    @{ file = "gallery_new_2.jpg"; title = "Emergency Medical Rescue"; title_mr = "आपत्कालीन वैद्यकीय मदत व रुग्णवाहिका सेवा"; category = "Healthcare"; category_mr = "आरोग्य सेवा" },
    @{ file = "gallery_new_3.jpg"; title = "Railway Station Humanitarian Aid"; title_mr = "रेल्वे स्थानकावर माणुसकीची साथ"; category = "Social Service"; category_mr = "सामाजिक कार्य" },
    @{ file = "gallery_new_4.jpg"; title = "New Ambulance Inauguration"; title_mr = "नवीन रुग्णवाहिका उद्घाटन सोहळा"; category = "Healthcare"; category_mr = "आरोग्य सेवा" }
)

$copiedFiles = @()

for ($i = 0; $i -lt 4; $i++) {
    $imgInfo = $imageNames[$i]
    Write-Host ""
    Write-Host "Image $($i+1) of 4: $($imgInfo.title_mr)" -ForegroundColor Green
    Write-Host "-------------------------------------------" -ForegroundColor DarkGray

    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = "Image $($i+1) निवडा: $($imgInfo.title_mr)"
    $dialog.Filter = "Images (*.jpg;*.jpeg;*.png;*.jfif;*.webp)|*.jpg;*.jpeg;*.png;*.jfif;*.webp"
    $dialog.InitialDirectory = [Environment]::GetFolderPath("MyPictures")

    # Try WhatsApp default locations
    $whatsappFolders = @(
        "$env:USERPROFILE\Pictures\WhatsApp Images\Sent",
        "$env:USERPROFILE\Pictures\WhatsApp Images",
        "$env:USERPROFILE\Downloads",
        "$env:USERPROFILE\OneDrive\Pictures"
    )
    foreach ($wf in $whatsappFolders) {
        if (Test-Path $wf) {
            $dialog.InitialDirectory = $wf
            break
        }
    }

    $result = $dialog.ShowDialog()

    if ($result -eq [System.Windows.Forms.DialogResult]::OK) {
        $srcFile = $dialog.FileName
        $destFile = Join-Path $publicFolder $imgInfo.file

        Copy-Item -Path $srcFile -Destination $destFile -Force
        Write-Host "✅ Copied: $($imgInfo.file)" -ForegroundColor Green
        $copiedFiles += $imgInfo
    } else {
        Write-Host "⚠️  Image $($i+1) skip केली." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Database Update करत आहे..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Now add to SQLite database via Python
$pythonScript = @"
import sqlite3
import sys

db_path = r'$dbPath'
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get max order
cursor.execute('SELECT MAX("order") FROM galleryitem')
row = cursor.fetchone()
max_order = (row[0] or 0)

new_items = [
"@

foreach ($item in $copiedFiles) {
    $pythonScript += "    ('/$($item.file)', '$($item.title)', '$($item.title_mr)', '$($item.category)', '$($item.category_mr)'),`n"
}

$pythonScript += @"
]

for idx, (image_url, title, title_mr, category, category_mr) in enumerate(new_items):
    max_order += 1
    cursor.execute('''
        INSERT INTO galleryitem (image_url, title, title_mr, category, category_mr, "order")
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (image_url, title, title_mr, category, category_mr, max_order))
    print(f'Added: {title_mr}')

conn.commit()
conn.close()
print('Database updated successfully!')
"@

$tempPy = "$env:TEMP\add_gallery.py"
$pythonScript | Out-File -FilePath $tempPy -Encoding UTF8

# Try python commands
$pythonCmd = $null
foreach ($cmd in @("python", "python3", "py")) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        $pythonCmd = $cmd
        break
    }
}

if ($pythonCmd) {
    Write-Host "Python सापडला: $pythonCmd" -ForegroundColor Green
    & $pythonCmd $tempPy
} else {
    Write-Host "⚠️ Python सापडला नाही. Database manually update करा." -ForegroundColor Yellow
    Write-Host "Images मात्र copy झाल्या आहेत." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Done! Gallery update झाली!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "आता browser refresh करा." -ForegroundColor Cyan
Write-Host ""
Read-Host "Enter दाबा बंद करण्यासाठी"
