pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    environment {
        CI = 'true'
        APP_NAME = 'jenkins-react-project'
        NGINX_PATH = 'C:\\nginx\\html\\jenkins-react-project'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo '🧹 Cleaning workspace...'
                deleteDir()
            }
        }

        stage('Checkout Code') {
            steps {
                echo '📦 Cloning repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm packages...'
                bat '''
                    if exist package-lock.json (
                        npm ci
                    ) else (
                        npm install
                    )
                '''
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test -- --watchAll=false'
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building React app...'
                bat 'npm run build'
            }
        }

        stage('Validate Build') {
            steps {
                echo '🔍 Checking build output...'
                bat '''
                    if not exist build\\index.html (
                        echo ❌ Build failed - index.html missing
                        exit /b 1
                    )
                '''
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo '📚 Archiving build files...'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo '🚀 Deploying to Nginx...'
                bat '''
                    echo =====================================
                    echo Deployment Starting
                    echo =====================================

                    set SOURCE=%WORKSPACE%\\build
                    set TARGET=C:\\nginx\\html\\jenkins-react-project

                    echo Source: %SOURCE%
                    echo Target: %TARGET%

                    if not exist "%SOURCE%\\index.html" (
                        echo ❌ Build folder invalid
                        exit /b 1
                    )

                    if not exist "%TARGET%" mkdir "%TARGET%"

                    echo Cleaning old files...
                    del /Q /F "%TARGET%\\*" 2>nul
                    for /d %%p in ("%TARGET%\\*") do rmdir /Q /S "%%p" 2>nul

                    echo Copying new build...
                    xcopy /E /Y /I "%SOURCE%\\*" "%TARGET%\\"

                    echo Verifying deployment...
                    if exist "%TARGET%\\index.html" (
                        echo ✅ Deployment SUCCESS
                    ) else (
                        echo ❌ Deployment FAILED
                        exit /b 1
                    )

                    dir "%TARGET%"
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 SUCCESS: React app deployed successfully!'
        }

        failure {
            echo '❌ FAILED: Check Jenkins logs'
        }

        always {
            echo '📌 Pipeline completed'
        }
    }
}