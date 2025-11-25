// Declarative Pipeline - Similar structure to GitLab CI
pipeline {
    // Agent: Where to run the pipeline (like GitLab's "tags")
    agent any
    
    // Environment variables (like GitLab's "variables")
    environment {
        IMAGE_NAME = 'express-ci'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        // DOCKERHUB_CREDENTIALS_USR will be username
        // DOCKERHUB_CREDENTIALS_PSW will be password
    }
    
    // Tools: Specify which tools to use
    tools {
        nodejs 'node-18'  // Must match the name in Global Tool Configuration
    }
    
    // Stages: Same concept as GitLab CI stages
    stages {
        
        // Stage 1: Checkout Code
        // Jenkins automatically checks out code if GitHub integration is set up
        stage('Checkout') {
            steps {
                echo '==> Checking out code from GitHub'
                checkout scm  // SCM = Source Code Management
            }
        }
        
        // Stage 2: Test
        stage('Test') {
            steps {
                echo '==> Installing dependencies'
                sh 'npm install'
                
                echo '==> Running tests'
                sh 'npm test'
            }
        }
        
        // Stage 3: Build Docker Image
        stage('Build Image') {
            steps {
                script {
                    echo '==> Building Docker image'
                    // Use docker.build() method from Docker Pipeline plugin
                    dockerImage = docker.build("${IMAGE_NAME}:${BUILD_NUMBER}")
                    // BUILD_NUMBER is a Jenkins built-in variable (auto-incrementing)
                    
                    // Also tag as latest
                    sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${IMAGE_NAME}:latest"
                }
            }
        }
        
        // Stage 4: Push to DockerHub
        stage('Push Image') {
            steps {
                script {
                    echo '==> Logging into DockerHub'
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    
                    echo '==> Tagging image'
                    sh "docker tag ${IMAGE_NAME}:latest ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:latest"
                    sh "docker tag ${IMAGE_NAME}:${BUILD_NUMBER} ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:${BUILD_NUMBER}"
                    
                    echo '==> Pushing images'
                    sh "docker push ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:latest"
                    sh "docker push ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:${BUILD_NUMBER}"
                }
            }
        }
        
        // Stage 5: Deploy
        stage('Deploy') {
            steps {
                script {
                    echo '==> Deploying application'
                    sh "docker pull ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:latest"
                    
                    // Stop and remove old container
                    sh 'docker stop express-ci || true'
                    sh 'docker rm express-ci || true'
                    
                    // Run new container
                    sh """
                        docker run -d \
                          --name express-ci \
                          -p 3000:3000 \
                          --restart=always \
                          ${DOCKERHUB_CREDENTIALS_USR}/${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }
    
    // Post actions: Run after pipeline completes (like GitLab's after_script)
    post {
        always {
            echo '==> Cleaning up'
            // Clean workspace
            cleanWs()
        }
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}