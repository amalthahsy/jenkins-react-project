pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'  // Must match Jenkins Global Tool config
    }

    environment {
        CI = 'true'
        NODE_ENV = 'development'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📦 Checking out code from GitHub...'
                checkout scm
            }
        }

        stage('Setup') {
            steps {
                echo '🔧 Setting up Node.js environment...'
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                bat 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                bat 'npm test -- --watchAll=false --coverage'
            }
            post {
                always {
                    junit 'test-results.xml'
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Test Coverage Report'
                    ])
                }
            }
        }

        stage('Build') {
            steps {
                echo '🏗️ Building React application...'
                bat 'npm run build'
            }
        }

        stage('Archive Build') {
            steps {
                echo '📚 Archiving build artifacts...'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }

        stage('Deploy to Local Nginx') {
            steps {
                echo '🚀 Deploying to local Nginx server...'
                bat '''
                    echo Cleaning old deployment...
                    rmdir /S /Q C:\\nginx\\html\\jenkins-react-demo

                    echo Creating folder...
                    mkdir C:\\nginx\\html\\jenkins-react-demo

                    echo Copying build files...
                    xcopy /E /I /Y "%WORKSPACE%\\build\\*" C:\\nginx\\html\\jenkins-react-project\\

                    echo Deployment complete!
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline succeeded! Application is deployed.'
        }

        failure {
            echo '❌ Pipeline failed! Check logs.'
        }

        always {
            echo '🎯 Pipeline execution completed.'
            cleanWs()
        }
    }
}