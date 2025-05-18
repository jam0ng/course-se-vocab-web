# run.ps1
chcp 65001 > $null
$OutputEncoding = [Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

# 명시적 경로 설정
$backendPath = "C:\Users\yoons.USERS\Desktop\CodeSpace\SW_Engineering_Project__Dev\SoftwareEngineering\backend"
$frontendPath = "C:\Users\yoons.USERS\Desktop\CodeSpace\SW_Engineering_Project__Dev\SoftwareEngineering\frontend"

# ✅ 백엔드 실행 (새 PowerShell 창에서)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$backendPath`"; npm start"

# ⏱️ 백엔드가 포트 여는 시간 잠깐 대기 (2초, 필요시 조절)
Start-Sleep -Seconds 2

# ✅ 프론트 실행 (현재 창에서)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$frontendPath`"; npm start"