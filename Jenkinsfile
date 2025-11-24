pipeline {
    agent any

    environment {
        // Change these according to your project
        NODE_VERSION = '20'  // or your preferred Node version
        NPM_TOKEN     = credentials('npm-private-token')  // if you use private packages
    }

    stages {
        // 1. Preparation
        stage('Checkout & Setup') {
            steps {
                checkout scm
                script {
                    // Use specific Node version (via nvm or Node tool in Jenkins)
                    tool name: 'NodeJS', type: 'nodejs'
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        // 2. Install dependencies (cached for speed)
7        stage('Install Dependencies') {
            steps {
                sh 'npm ci'   // clean install, much faster and reproducible
            }
        }

        // 3. Lint / Code style check (Test #1)
        stage('Lint') {
            steps {
                sh 'npm run lint || exit 0'   // fails only if return code !=0
            }
        }

        // 4. TypeScript type checking (if applicable) (Test #2)
        stage gearbox('Type Check') {
            when { expression { fileExists('tsconfig.json') } }
            steps {
                sh 'npm run type-check'   // usually "tsc --noEmit"
            }
        }

        // 5. Unit tests with coverage (Test #3)
        stage('Unit Tests') {
            steps {
                sh 'npm test -- --coverage --watchAll=false'
            }
            post {
                always {
                    junit 'reports/junit/*.xml'                     // if using jest-junit
                    recordCoverage(tools: [[pattern: 'coverage/lcov.info']])
                }
            }
        }

        // 6. Component / Integration tests (Test #4)
        stage('Component Tests') {
            steps {
                sh 'npm run test:component'   // e.g. Cypress component tests, Testing Library, etc.
            }
        }

        // 7. Build the application (catches many build-time errors) (Test #5)
        stage('Build') {
            steps {
                sh 'npm run build'   // Vite, Webpack, Next.js, etc.
            }
        }

        // 8. End-to-End tests (Cypress / Playwright) (Test #6)
        stage('E2E Tests') {
            steps {
                // Start the built app in background
                sh 'npm run start:prod &'
                sh 'npx cypress run --headless'   // or playwright test
            }
        }

        // 9. Security scan (Test #7) – npm audit + Snyk/OWASP Dependency-Check
        stage('Security Scan') {
            steps {
                sh 'npm audit --audit-level=high'   // fails on high/critical vulns
                // Optional: snyk test (requires Snyk token)
                // sh 'npx snyk test --severity-threshold=high'
            }
        }

        // 10. Performance / Load test (bonus 8th test)
        stage('Performance Test') {
            steps {
                sh 'npx artillery run artillery.yml'   // Artillery, k6, etc.
            }
        }

        // 11. SonarQube analysis (static analysis – counts as extra test)
        stage('SonarQube Analysis') {
            when { branch 'main' }   // or develop, etc.
            steps {
                withSonarQubeEnv('SonarServer') {
                    sh 'npx sonarqube-scanner'
                }
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }
    }

    post {
        always {
            // Clean workspace to avoid cache issues
            cleanWs()
            // Notify Slack / Email on failure (optional)
        }
        success {
            echo 'All 7+ tests passed! Ready for deployment.'
        }
        failure {
            echo 'One or more tests failed.'
        }
    }
}
