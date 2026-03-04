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

        // ── Stage 1: Get Code ──────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
                echo '✅ Checkout complete!'
            }
        }

        // ── Stage 2: Install Dependencies ─────────────
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                sh 'npm install'
                echo '✅ Dependencies installed!'
            }
        }

        // ── Stage 3: Run Tests ─────────────────────────
        stage('Run Tests') {
            steps {
                echo '🧪 Running tests...'
                sh 'npm test'
                echo '✅ All tests passed!'
            }
            post {
                failure {
                    echo '❌ Tests FAILED! Pipeline stopped.'
                }
            }
        }

        // ── Stage 4: Code Analysis ─────────────────────
        stage('Code Analysis') {
            steps {
                echo '🔍 Checking for vulnerabilities...'
                sh 'npm audit --audit-level=moderate || true'
                echo '✅ Code analysis done!'
            }
        }

        // ── Stage 5: Build Docker Image ────────────────
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh """
                    docker build \
                        --tag ${DOCKER_IMAGE}:${DOCKER_TAG} \
                        --tag ${DOCKER_IMAGE}:latest \
                        .
                """
                echo "✅ Image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
            }
        }

        // ── Stage 6: Push to Docker Hub ────────────────
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
                echo '✅ Image pushed to Docker Hub!'
            }
        }

        // ── Stage 7: Deploy ────────────────────────────
        stage('Deploy') {
            steps {
                echo '🏥 Deploying Hospital Management System...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${APP_PORT}:3000 \
                        -e NODE_ENV=production \
                        -e MONGODB_URI=mongodb://mongo:27017/hospital \
                        ${DOCKER_IMAGE}:${DOCKER_TAG}
                """
                echo '✅ Deployment complete!'
            }
        }

        // ── Stage 8: Health Check ──────────────────────
        stage('Health Check') {
            steps {
                echo '🏥 Checking application health...'
                sh 'sleep 10'
                sh 'curl -f http://localhost:3000/health || exit 1'
                echo '✅ Application is healthy!'
            }
        }
    }

    post {
        always {
            echo '🧹 Cleaning up...'
            sh 'docker image prune -f || true'
        }
        success {
            echo '🎉 Pipeline SUCCEEDED! Hospital app is live!'
        }
        failure {
            echo '💔 Pipeline FAILED! Check the logs above.'
        }
    }
}