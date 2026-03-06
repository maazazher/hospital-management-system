pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = 'maazazher/hospital-app'
        DOCKER_TAG     = "${BUILD_NUMBER}"
        CONTAINER_NAME = 'hospital-production'
        APP_PORT       = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                echo 'Checkout complete!'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'rm -rf node_modules package-lock.json'
                sh 'npm install'
                echo 'Dependencies installed!'
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test'
                echo 'Tests passed!'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} -t ${DOCKER_IMAGE}:latest ."
                echo 'Image built!'
            }
        }

        stage('Push to Docker Hub') {
            steps {
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
            }
        }

        stage('Deploy') {
            steps {
                sh "docker stop ${CONTAINER_NAME} || true"
                sh "docker rm ${CONTAINER_NAME} || true"
                sh "docker run -d --name ${CONTAINER_NAME} -p ${APP_PORT}:3000 -e NODE_ENV=production ${DOCKER_IMAGE}:${DOCKER_TAG}"
                echo 'Deployed!'
            }
        }

        stage('Health Check') {
            steps {
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