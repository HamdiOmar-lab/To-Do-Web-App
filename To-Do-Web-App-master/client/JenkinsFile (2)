pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run tests') {
            steps {
                sh 'npm test -- --watchAll=false'
            }
        }

        stage('Build React app') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker image') {
            steps {
                sh 'docker build -t my-react-app:dev .'
            }
        }
    }

    post {
        success {
            echo "✔️ Build completed successfully"
        }
        failure {
            echo "❌ Build failed"
        }
    }
}
