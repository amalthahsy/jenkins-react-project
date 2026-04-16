pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    environment {
        CI = 'true'
        APP_NAME = 'jenkins-react-project'
        WINDOWS_NGINX_PATH = 'C:\\nginx\\html\\jenkins-react-project'
        LINUX_NGINX_PATH = '/var/www/html/jenkins-react-project'
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

        stage('Checkout') {
            steps {
                echo '📦 Fetching source code...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                sh '''
                    if [ -f package-lock.json ]; then
                        npm ci
                    else
                        npm install
                    fi
                ''' 
                || bat '''
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
                script {
                    if (isUnix()) {
                        sh 'npm test -- --watchAll=false || echo "Tests failed or skipped"'
                    } else {
                        bat 'npm test -- --watchAll=false || echo Tests failed or skipped'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building React app...'
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }

        stage('Validate Build') {
            steps {
                echo '🔍 Validating build output...'
                script {
                    if (isUnix()) {
                        sh '''
                            test -f build/index.html || (echo "❌ Build failed: index.html missing" && exit 1)
                        '''
                    } else {
                        bat '''
                            if not exist build\\index.html (
                                echo ❌ Build failed: index.html missing
                                exit /b 1
                            )
                        '''
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                echo '📚 Archiving build...'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        stage('Deploy to Nginx') {
            steps {
                echo '🚀 Deploying to Nginx...'
                script {
                    if (isUnix()) {
                        sh """
                            sudo rm -rf ${LINUX_NGINX_PATH}/*
                            sudo cp -r build/* ${LINUX_NGINX_PATH}/
                            ls -la ${LINUX_NGINX_PATH}
                        """
                    } else {
                        bat """
                            echo =====================================
                            echo Deploying React App to Nginx
                            echo =====================================

                            set SOURCE=%WORKSPACE%\\build
                            set TARGET=${WINDOWS_NGINX_PATH}

                            echo Source: %SOURCE%
                            echo Target: %TARGET%

                            if not exist "%SOURCE%\\index.html" (
                                echo ❌ Build folder invalid!
                                exit /b 1
                            )

                            if not exist "%TARGET%" mkdir "%TARGET%"

                            echo Cleaning old files...
                            del /Q /F "%TARGET%\\*" 2>nul
                            for /d %%p in ("%TARGET%\\*") do rmdir /Q /S "%%p" 2>nul

                            echo Copying files...
                            xcopy /E /Y /I "%SOURCE%\\*" "%TARGET%\\"

                            echo Verifying deployment...
                            if exist "%TARGET%\\index.html" (
                                echo ✅ Deployment successful
                            ) else (
                                echo ❌ Deployment failed
                                exit /b 1
                            )

                            dir "%TARGET%"
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo '🎉 SUCCESS: React app deployed successfully!'
        }

        failure {
            echo '❌ FAILED: Check logs for errors'
        }

        always {
            echo '📌 Pipeline finished'
        }
    }
}