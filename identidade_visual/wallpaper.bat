@echo off
:: COLOQUE O CAMINHO DA SUA IMAGEM ABAIXO (Exemplo: C:\Imagens\wallpaper.png)
set "img_path=C:\Suporte\wallpaper.png"

:: 1. Define o papel de parede no registro do usuário atual
reg add "HKCU\Control Panel\Desktop" /v Wallpaper /t REG_SZ /d "%img_path%" /f
reg add "HKCU\Control Panel\Desktop" /v WallpaperStyle /t REG_SZ /d "10" /f
reg add "HKCU\Control Panel\Desktop" /v TileWallpaper /t REG_SZ /d "0" /f

:: 2. BLOQUEIA a alteração do papel de parede (Política de Personalização)
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\ActiveDesktop" /v NoChangingWallPaper /t REG_DWORD /d 1 /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v Wallpaper /t REG_SZ /d "%img_path%" /f
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Policies\System" /v WallpaperStyle /t REG_SZ /d "2" /f

:: 3. Atualiza as configurações sem precisar reiniciar
RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters

echo Papel de parede definido e bloqueado com sucesso!
pause