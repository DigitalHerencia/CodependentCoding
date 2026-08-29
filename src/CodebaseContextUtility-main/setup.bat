@echo off
echo Setting up Codebase Context Utility...

:: Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION%

:: Simple version check (just checking if it starts with v18 or higher)
set NODE_MAJOR=%NODE_VERSION:~1,2%
if %NODE_MAJOR% LSS 18 (
  echo Error: Node.js version v18.0.0 or higher is required. Current version: %NODE_VERSION%
  exit /b 1
)

:: Install dependencies
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo Failed to install dependencies
  exit /b 1
)

:: Create necessary directories if they don't exist
if not exist "components\ui" mkdir "components\ui"
if not exist "lib" mkdir "lib"
if not exist "utils" mkdir "utils"
if not exist "public" mkdir "public"

echo Setup complete! You can now run the development server:
echo npm run dev
echo Then open http://localhost:3000 in your browser.
