pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-18'   // Make sure this matches the name in Jenkins configuration
    }

    environment {
        DOCKER_IMAGE   = 'maazazher/hospital-app'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'hospital-production'
        APP_PORT       = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out code...'
                checkout scm
                echo '✅ Checkout done!'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
                echo '✅ Done!'
            }
        }

        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test'
                echo '✅ Tests passed!'
            }
            post {
                failure {
                    echo '❌ Tests FAILED!'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                echo '✅ Image built!'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo '🚀 Pushing to Docker Hub...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                    sh "docker push ${DOCKER_IMAGE}:latest"
                    sh 'docker logout'
                }
                echo '✅ Pushed!'
            }
        }

        stage('Deploy') {
            steps {
                echo '🏥 Deploying...'
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p ${APP_PORT}:3000 -e NODE_ENV=production ${DOCKER_IMAGE}:${DOCKER_TAG}"
                echo '✅ Deployed!'
            }
        }

        stage('Health Check') {
            steps {
                echo '🏥 Health check...'
                sh 'sleep 10'
                sh 'curl -f http://localhost:3000/health || exit 1'
                echo '✅ App is healthy!'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
        }
        success {
            echo '🎉 Pipeline SUCCEEDED! Hospital app is live!'
        }
        failure {
            echo '💔 Pipeline FAILED!'
        }
    }
}