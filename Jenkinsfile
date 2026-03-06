pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = 'maazazher/hospital-app'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'hospital-production'
        APP_PORT       = '3000'
    }

    options {
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
                echo 'Checkout complete!'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm install express mongoose cors body-parser dotenv'
                sh 'npm install --save-dev jest supertest'
                echo 'Dependencies installed!'
            }
        }

        stage('Run Tests') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
                echo 'Tests passed!'
            }
            post {
                failure {
                    echo 'Tests FAILED!'
                }
            }
        }

        stage('Code Analysis') {
            steps {
                echo 'Running code analysis...'
                sh 'npm audit --audit-level=moderate || true'
                echo 'Code analysis done!'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                echo 'Image built!'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing to Docker Hub...'
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
                echo 'Pushed to Docker Hub!'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying...'
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p ${APP_PORT}:3000 -e NODE_ENV=production -e MONGODB_URI=mongodb://mongo:27017/hospital ${DOCKER_IMAGE}:${DOCKER_TAG}"
                echo 'Deployed!'
            }
        }

        stage('Health Check') {
            steps {
                echo 'Checking health...'
                sh 'sleep 15'
                sh 'curl -f http://localhost:3000/health || true'
                echo 'Health check done!'
            }
        }
    }

    post {
        always {
            sh 'docker image prune -f || true'
        }
        success {
            echo 'Pipeline SUCCEEDED!'
        }
        failure {
            echo 'Pipeline FAILED!'
        }
    }
}
