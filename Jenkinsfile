pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-16'  // Must match name in Global Tool Configuration
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
                sh 'node --version'
                sh 'npm --version'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📥 Installing npm dependencies...'
                sh 'npm install'
            }
        }
        
        stage('Test') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test -- --watchAll=false --coverage'
            }
            post {
                always {
                    // Archive test results even if tests fail
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
                sh 'npm run build'
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
                // Copy build files to Nginx html directory
                bat '''
                    echo "Stopping existing deployment..."
                    xcopy /E /Y /I build\\* C:\\nginx\\html\\jenkins-react-project\\
                    echo "Deployment complete!"
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline succeeded! Application is deployed.'
            // You can add Slack/Email notifications here
        }
        failure {
            echo '❌ Pipeline failed! Check the logs for errors.'
            // Add failure notifications here
        }
        always {
            echo '🎯 Pipeline execution completed.'
            cleanWs() // Clean workspace
        }
    }
}