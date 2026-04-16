pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-24'
    }
    
    environment {
        CI = 'true'
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
                script {
                    echo '🔧 Setting up Node.js environment...'
                    if (isUnix()) {
                        sh 'node --version'
                        sh 'npm --version'
                    } else {
                        bat 'node --version'
                        bat 'npm --version'
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                script {
                    if (isUnix()) {
                        sh 'npm install'
                    } else {
                        bat 'npm install'
                    }
                }
            }
        }
        stage('Debug - Check Files') {
           steps {
            script {
            echo '📁 Listing all files in src directory:'
            if (isUnix()) {
                sh 'ls -la src/'
                sh 'find src -name "*.test.js" -o -name "*.spec.js"'
            } else {
                bat 'dir src'
                bat 'dir /s /b src\\*.test.js'
                bat 'dir /s /b src\\*.spec.js'
                 }
              }
            }
          }
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                script {
                    if (isUnix()) {
                        sh 'npm test -- --watchAll=false'
                    } else {
                        bat 'npm test -- --watchAll=false'
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo '🏗️ Building React application...'
                script {
                    if (isUnix()) {
                        sh 'npm run build'
                    } else {
                        bat 'npm run build'
                    }
                }
            }
        }
        
        stage('Archive Build') {
            steps {
                echo '📚 Archiving build artifacts...'
                archiveArtifacts artifacts: 'build/**', fingerprint: true
            }
        }
        
        stage('Deploy') {
            steps {
                echo '🚀 Deploying application...'
                script {
                    if (isUnix()) {
                        sh '''
                            mkdir -p /var/www/html/jenkins-react-demo
                            cp -r build/* /var/www/html/jenkins-react-demo/
                        '''
                    } else {
                        bat '''
                            @echo off
                            if not exist "C:\\nginx\\html\\jenkins-react-project" mkdir "C:\\nginx\\html\\jenkins-react-project"
                            xcopy /E /Y /I build\\* C:\\nginx\\html\\jenkins-react-project\\
                        '''
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            echo '🎯 Pipeline execution completed.'
            cleanWs()
        }
    }
}