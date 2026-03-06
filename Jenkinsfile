pipeline {
agent any
environment {
DOCKER_IMAGE = 'your-dockerhub-username/hospital-app'
DOCKER_TAG = "${BUILD_NUMBER}"
CONTAINER_NAME = 'hospital-production'
APP_PORT = '3000'
}
options {
timeout(time: 20, unit: 'MINUTES')
disableConcurrentBuilds()
buildDiscarder(logRotator(numToKeepStr: '10'))
}
stages {
stage('Checkout') {
steps {
echo ' Cloning repository...'
checkout scm
echo ' Checkout complete!'
}
}
stage('Install Dependencies') {
steps {
echo ' Installing Node.js dependencies...'
sh 'npm install'
echo ' Dependencies installed!'
}
}
stage('Run Tests') {
steps {
echo ' Running automated tests...'
sh 'npm test'
echo ' All tests passed!'
}
post {
failure { echo ' Tests FAILED! Build stopped.' }
}
}
stage('Code Analysis') {
steps {
sh 'npm audit --audit-level=moderate || true'
}
}
steps {
sh """
docker build \\--tag ${DOCKER_IMAGE}:${DOCKER_TAG} \\--tag ${DOCKER_IMAGE}:latest .
"""
echo " Image built: ${DOCKER_IMAGE}:${DOCKER_TAG}"
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
sh """
docker stop ${CONTAINER_NAME} || true
docker rm ${CONTAINER_NAME} || true
docker run -d \\--name ${CONTAINER_NAME} \\--restart unless-stopped \\-p ${APP_PORT}:3000 \\-e NODE_ENV=production \\
${DOCKER_IMAGE}:${DOCKER_TAG}
"""
echo ' Deployment complete!'
}
}
stage('Health Check') {
steps {
sh 'sleep 10'
sh 'curl -f http://localhost:3000/health || exit 1'
echo ' Application is healthy!'
}
}
}
post {
always { sh 'docker image prune -f || true' }
success { echo ' Pipeline SUCCEEDED! Hospital app is live!' }
failure { echo ' Pipeline FAILED! Check the logs above.' }
}
}