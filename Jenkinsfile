groovy
pipeline {
    agent any // Utiliser 'any' pour s'exécuter sur n'importe quel agent disponible.
              // Alternativement, pour un environnement plus contrôlé:
              // agent {
              //     docker {
              //         image 'openjdk:17-jdk-slim-buster' // Image de base pour Java
              //         args '-v /var/run/docker.sock:/var/run/docker.sock' // Pour Docker-in-Docker si besoin
              //     }
              // }
              // Il faudrait une image Docker avec Java et Node.js installés pour ce pipeline.

    environment {
        // Définir les ports utilisés par les applications
        BACKEND_PORT = "8080"
        FRONTEND_PORT = "4200"
        // Variables pour stocker les PID des processus démarrés en arrière-plan
        BACKEND_PID = ""
        FRONTEND_PID = ""
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        echo 'Building Spring Boot backend application...'
                        // Nettoyer et construire l'application Spring Boot, en sautant les tests unitaires/d'intégration
                        // car les tests E2E couvriront la fonctionnalité globale.
                        sh './mvnw clean install -DskipTests'
                    }
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                script {
                    dir('frontend') {
                        echo 'Installing Angular frontend dependencies...'
                        // Installer les dépendances npm pour l'application Angular
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Install Cypress Dependencies') {
            // Cette étape suppose que Cypress est une dépendance de développement définie dans un `package.json`
            // à la racine du projet, distinct de celui du `frontend/`.
            // Si Cypress est géré comme une dépendance du `frontend/package.json`, cette étape peut être fusionnée
            // avec 'Install Frontend Dependencies' et exécutée dans le répertoire 'frontend'.
            steps {
                echo 'Installing Cypress E2E test runner dependencies...'
                sh 'npm install'
            }
        }

        stage('Start Backend Application') {
            steps {
                script {
                    echo "Starting Spring Boot backend application on port ${env.BACKEND_PORT} in background..."
                    // Démarrer l'application Spring Boot en arrière-plan et capturer son PID.
                    // 'nohup' pour détacher le processus du terminal, et rediriger la sortie vers un fichier log.
                    sh """
                        nohup java -jar backend/target/*.jar --spring.profiles.active=dev > backend.log 2>&1 &
                        echo \$! > backend.pid
                    """
                    env.BACKEND_PID = readFile('backend.pid').trim()
                    echo "Backend process started with PID: ${env.BACKEND_PID}"

                    // Attendre que l'application backend soit pleinement opérationnelle et réactive.
                    timeout(time: 180, unit: 'SECONDS') { // Timeout de 3 minutes pour le démarrage du backend
                        waitUntil {
                            script {
                                try {
                                    // Vérifier l'endpoint de santé du Spring Boot Actuator
                                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${env.BACKEND_PORT}/api/management/health", returnStdout: true).trim()
                                    echo "Backend health check response: ${response}"
                                    return response == '200'
                                } catch (Exception e) {
                                    echo "Backend not yet ready: ${e.getMessage()}"
                                    return false
                                }
                            }
                        }
                    }
                    echo "Backend application started successfully on port ${env.BACKEND_PORT}."
                }
            }
        }

        stage('Start Frontend Application') {
            steps {
                script {
                    dir('frontend') {
                        echo "Starting Angular frontend application on port ${env.FRONTEND_PORT} in background..."
                        // Démarrer l'application Angular en arrière-plan et capturer son PID.
                        // On suppose que 'npm start' exécute 'ng serve' sur le port 4200 comme défini dans cypress.config.ts.
                        sh """
                            nohup npm start > frontend.log 2>&1 &
                            echo \$! > frontend.pid
                        """
                    }
                    env.FRONTEND_PID = readFile('frontend/frontend.pid').trim()
                    echo "Frontend process started with PID: ${env.FRONTEND_PID}"

                    // Attendre que l'application frontend soit pleinement opérationnelle et réactive.
                    timeout(time: 180, unit: 'SECONDS') { // Timeout de 3 minutes pour le démarrage du frontend
                        waitUntil {
                            script {
                                try {
                                    // Le serveur de développement Angular CLI renvoie un code 200 pour la racine une fois prêt.
                                    def response = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:${env.FRONTEND_PORT}", returnStdout: true).trim()
                                    echo "Frontend health check response: ${response}"
                                    return response == '200'
                                } catch (Exception e) {
                                    echo "Frontend not yet ready: ${e.getMessage()}"
                                    return false
                                }
                            }
                        }
                    }
                    echo "Frontend application started successfully on port ${env.FRONTEND_PORT}."
                }
            }
        }

        stage('Run Cypress E2E Tests') {
            steps {
                script {
                    echo 'Executing Cypress E2E tests...'
                    // Exécuter les tests Cypress. On suppose que 'cypress.config.ts' est à la racine du projet
                    // et que la commande 'npx cypress run' est exécutée depuis la racine.
                    sh 'npx cypress run'
                }
            }
        }
    }

    post {
        always {
            script {
                echo 'Cleaning up background processes...'
                // Tenter de tuer le processus backend si son PID est connu et qu'il est toujours actif
                if (env.BACKEND_PID && sh(script: "ps -p ${env.BACKEND_PID} > /dev/null", returnStatus: true) == 0) {
                    sh "kill ${env.BACKEND_PID}"
                    echo "Killed backend process with PID ${env.BACKEND_PID}"
                } else {
                    echo "Backend process with PID ${env.BACKEND_PID} not found or already stopped."
                }

                // Tenter de tuer le processus frontend si son PID est connu et qu'il est toujours actif
                if (env.FRONTEND_PID && sh(script: "ps -p ${env.FRONTEND_PID} > /dev/null", returnStatus: true) == 0) {
                    sh "kill ${env.FRONTEND_PID}"
                    echo "Killed frontend process with PID ${env.FRONTEND_PID}"
                } else {
                    echo "Frontend process with PID ${env.FRONTEND_PID} not found or already stopped."
                }

                // Nettoyer les fichiers PID créés
                sh "rm -f backend.pid frontend/frontend.pid || true"
            }
        }
        success {
            echo 'E2E tests passed successfully! 🎉'
        }
        failure {
            echo 'E2E tests failed. 🐛 Review the logs and Cypress artifacts.'
            // En cas d'échec, vous pouvez archiver les artefacts Cypress (vidéos, captures d'écran)
            // archiveArtifacts artifacts: 'cypress/videos/**/*.mp4, cypress/screenshots/**/*.png', allowEmpty: true
        }
    }
}