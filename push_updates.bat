@echo off
echo Adding all files...
git add .
echo Committing changes...
if "%~1"=="" (
    set "msg=Update"
) else (
    set "msg=%~1"
)
git commit -m "%msg%"
echo Pushing to remote...
git push
echo Done!
pause
