pipeline {
    agent any

    environment {
        DOCKER_REPO = "miusuario/apollo-frontend"  // Cambiar con tu repositorio de Docker
        BRANCH_NAME = "${env.BRANCH_NAME}"       // Rama actual del PR
        BUILD_VERSION = "${env.BUILD_NUMBER}"    // Número único de build de Jenkins
        PACKAGE_VERSION = ''                     // Almacenará la versión del package.json
        IMAGE_TAG = ''                           // Etiqueta para la imagen Docker
    }

    stages {
        stage ('Ver variables de entorno') {
          steps {
                script {
                    echo "🌍 Variables de entorno: ${env}"
                }
            }
        }
        stage('Checkout') {
            steps {
                checkout scm // Esta es la acción para clonar el repositorio
                script {
                    echo "📥 Se han bajado los cambios de la rama ${BRANCH_NAME}"
                }
            }
        }

        stage('Obtener versión del package.json') {
            steps {
                script {
                    // Obtener la versión desde el archivo package.json
                    PACKAGE_VERSION = sh(script: "jq -r .version package.json", returnStdout: true).trim()
                    echo "📌 Versión extraída: ${PACKAGE_VERSION}"
                }
            }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                script {
                    // Ejecutar las pruebas unitarias con Jest para Angular
                    echo "⚡ Ejecutando pruebas unitarias..."
                    sh 'npm install'
                    sh 'npm run test -- --coverage'

                    // Comprobación de la cobertura
                    def coverage = sh(script: 'grep -oP "(?<=\\s)100\\.(\\d+)" coverage/lcov-report/index.html', returnStdout: true).trim()
                    if (coverage.toInteger() < 80) {
                        error "🚨 Cobertura de pruebas menor al 80%. No se puede continuar con el pipeline."
                    }
                }
            }
        }

        stage('Análisis con SonarQube') {
            steps {
                script {
                    // Análisis del código con SonarQube
                    echo "🔍 Ejecutando análisis con SonarQube..."
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Construir imagen Docker') {
            steps {
                script {
                    // Generamos la etiqueta con los detalles: versión, número de build y rama
                    def imageTag = "${DOCKER_REPO}:${PACKAGE_VERSION}-${BUILD_VERSION}-${BRANCH_NAME}"
                    env.IMAGE_TAG = imageTag

                    // Construimos la imagen de Docker
                    echo "🚀 Construyendo imagen: ${env.IMAGE_TAG}"
                    sh "docker build -t ${env.IMAGE_TAG} ."
                    sh "docker tag ${env.IMAGE_TAG} ${DOCKER_REPO}:${PACKAGE_VERSION}"
                    sh "docker tag ${env.IMAGE_TAG} ${DOCKER_REPO}:latest"
                }
            }
        }

        stage('Publicar imagen en Docker Hub') {
            steps {
                script {
                    // Autenticación con Docker Hub y publicación de las imágenes
                    withDockerRegistry([credentialsId: 'docker-hub-cred', url: '']) {
                        echo "📤 Publicando imagen en Docker Hub..."
                        sh "docker push ${env.IMAGE_TAG}"
                        sh "docker push ${DOCKER_REPO}:${PACKAGE_VERSION}"
                        sh "docker push ${DOCKER_REPO}:latest"
                    }
                }
            }
        }

        stage('Desplegar en EKS') {
            steps {
                script {
                    // Desplegar en EKS para validar cambios (efímero)
                    echo "🚀 Desplegando en EKS..."
                    sh './deploy_to_eks.sh'  // Asumiendo que tienes un script para deploy en EKS
                }
            }
        }
    }

    post {
        success {
            script {
                // Solo eliminar imágenes si estamos en la rama `master` después de un merge
                if (BRANCH_NAME != 'master') {
                    echo "✅ Fusión detectada en rama ${BRANCH_NAME}. Eliminando imágenes de ramas temporales..."

                    // Login a Docker Hub
                    sh "docker login -u 'miusuario' -p 'MI_DOCKERHUB_PASSWORD'"

                    // Eliminar las imágenes generadas por el PR
                    sh """
                    for tag in \$(curl -s -H "Authorization: Bearer MI_DOCKERHUB_TOKEN" "https://hub.docker.com/v2/repositories/miusuario/apollo-frontend/tags/" | jq -r '.results[].name' | grep -E '${BUILD_VERSION}-${BRANCH_NAME}')
                    do
                        echo "🚀 Eliminando imagen: ${DOCKER_REPO}:\$tag"
                        curl -X DELETE -H "Authorization: Bearer MI_DOCKERHUB_TOKEN" "https://hub.docker.com/v2/repositories/miusuario/apollo-frontend/tags/\$tag/"
                    done
                    """
                }
            }
        }

        failure {
            script {
                echo "❌ El pipeline ha fallado. Revisar logs."
            }
        }
    }
}
