pipeline {

    agent any

    tools {
        nodejs 'NodeJS-22'
    }

    stages {

        stage('Git Checkout') {
            steps {
                echo 'Downloading source code from GitHub'
                checkout scm
            }
        }

        stage('Backend Build') {
            steps {
                echo 'Building Spring Boot Backend'

                sh '''
                    chmod +x backend/gradlew
                    cd backend
                    ./gradlew clean build
                '''
            }
        }

        stage('Frontend Build') {
            steps {
                echo 'Building React Frontend'

                dir('frontend') {
                    sh '''
                        npm ci
                        npm run build
                    '''
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts:
                    'backend/build/libs/*.jar, frontend/dist/**, frontend/build/**',
                    allowEmptyArchive: true
            }
        }

    }

    post {
        success {
            echo 'Expense Tracker CI Pipeline Successful!'
        }

        failure {
            echo 'Expense Tracker CI Pipeline Failed!'
        }

    }
}