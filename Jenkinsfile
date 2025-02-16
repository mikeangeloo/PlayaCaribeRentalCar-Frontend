pipeline {
    agent any

    environment {
        DOCKER_REPO = "mikeangeloo/apollo-frontend"  // Cambiar con tu repositorio de Docker
        BRANCH_NAME = sh(script: "echo ${env.GIT_BRANCH} | sed 's|^origin/||'", returnStdout: true).trim()
        BUILD_VERSION = "${env.BUILD_NUMBER}"    // Número único de build de Jenkins
        PACKAGE_VERSION = ''                     // Almacenará la versión del package.json
        IMAGE_TAG = ''                           // Etiqueta para la imagen Docker
        DOCKER_IMAGE = ''                        // Definiendo para guardar la referencia de la imagen de docker

        GITHUB_API_URL = "https://api.github.com"
        GITHUB_TOKEN = credentials('GITHUB_TOKEN')  // Aquí usas el token configurado como credencial
        COMMIT_SHA = sh(script: "git rev-parse HEAD", returnStdout: true).trim()  // SHA del commit actual
    }

    stages {

        // stage('Start') {
        //   steps {
        //     script {
        //       // Actualizamos el estado inicial a github
        //       updateGitHubCommitStatus(
        //         context: 'ci/jenkins',
        //         state: 'pending',
        //         description: 'Pipeline in progress ...'
        //       )

        //       echo "Pipeline iniciado para el commit ${COMMIT_SHA}"
        //     }
        //   }
        // }

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

        stage('Contruir imagen Docker') {
          steps {
            script {
              // Construir la imagen Docker
              echo "🚀 Construyendo imagen Docker..."
              DOCKER_IMAGE = docker.build("${DOCKER_REPO}:${PACKAGE_VERSION}-${BUILD_VERSION}-${BRANCH_NAME}")
            }
          }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                script {
                  if (DOCKER_IMAGE) {
                    // Ejecutar las pruebas unitarias con Jest para Angular
                    echo "⚡ Ejecutando pruebas unitarias..."
                    DOCKER_IMAGE.inside {
                        // Posicionarse en el directorio correcto (aunque /app es el directorio de trabajo)
                        sh 'pwd'
                        sh 'ls -la'
                        sh 'npm run test:ci'  // Ejecutar pruebas unitarias

                        // Obtener la cobertura global desde el JSON de cobertura
                        def coverageJson = readJSON(file: 'coverage/coverage-summary.json')
                        def coverage = coverageJson.total.statements.pct  // Extrae el porcentaje de cobertura total

                        echo "📊 Cobertura de código: ${coverage}%"

                        if (coverage.toFloat() < 80) {
                            error "🚨 Cobertura de pruebas menor al 80%. No se puede continuar con el pipeline."
                        }
                    }
                  } else {
                    error "❌ La imagen Docker no se construyó correctamente. El pipeline se detiene."
                  }
                }
            }
        }

        // stage('Análisis con SonarQube') {
        //     steps {
        //         script {
        //             // Análisis del código con SonarQube
        //             echo "🔍 Ejecutando análisis con SonarQube..."
        //             sh 'sonar-scanner'
        //         }
        //     }
        // }

        // stage('Construir imagen Docker') {
        //     steps {
        //         script {
        //             // Generamos la etiqueta con los detalles: versión, número de build y rama
        //             def imageTag = "${DOCKER_REPO}:${PACKAGE_VERSION}-${BUILD_VERSION}-${BRANCH_NAME}"
        //             env.IMAGE_TAG = imageTag

        //             // Construimos la imagen de Docker
        //             echo "🚀 Construyendo imagen: ${env.IMAGE_TAG}"
        //             sh "docker build -t ${env.IMAGE_TAG} ."
        //             sh "docker tag ${env.IMAGE_TAG} ${DOCKER_REPO}:${PACKAGE_VERSION}"
        //             sh "docker tag ${env.IMAGE_TAG} ${DOCKER_REPO}:latest"
        //         }
        //     }
        // }

        stage('Publicar imagen en Docker Hub') {
            steps {
                script {
                    // Autenticación con Docker Hub y publicación de las imágenes
                    echo "📤 Publicando imagen en Docker Hub..."
                    withDockerRegistry([credentialsId: 'docker-hub-cred', url: '']) {
                        echo "📤 Publicando imagen en Docker Hub..."
                        sh "docker push ${env.IMAGE_TAG}"
                        sh "docker push ${DOCKER_REPO}:${PACKAGE_VERSION}"
                        sh "docker push ${DOCKER_REPO}:latest"
                    }
                }
            }
        }

        // stage('Desplegar en EKS') {
        //     steps {
        //         script {
        //             // Desplegar en EKS para validar cambios (efímero)
        //             echo "🚀 Desplegando en EKS..."
        //             sh './deploy_to_eks.sh'  // Asumiendo que tienes un script para deploy en EKS
        //         }
        //     }
        // }
    }

    // post {
    //     success {
    //         script {
    //             echo "✅ El pipeline ha tenido éxito. Actualizando estado en GitHub..."
    //             updateGitHubCommitStatus("success", "Build successful")
    //         }
    //     }

    //     failure {
    //         script {
    //             echo "❌ El pipeline ha fallado. Actualizando estado en GitHub..."
    //             updateGitHubCommitStatus("failure", "Build failed")
    //         }
    //     }
    // }
}

// Función personalizada para actualizar el estado del commit en GitHub
def updateGitHubCommitStatus(Map params) {
    def context = params.context ?: 'ci/jenkins'   // El nombre del contexto (por ejemplo, 'ci/jenkins')
    def state = params.state ?: 'pending'          // El estado: 'pending', 'success', 'failure'
    def description = params.description ?: 'Pipeline in progress ...' // Descripción del estado

    // Asegúrate de tener configuradas las credenciales de GitHub en Jenkins
    def credentialsId = 'GITHUB_TOKEN'  // El ID de las credenciales de GitHub en Jenkins

    withCredentials([usernamePassword(credentialsId: credentialsId, usernameVariable: 'GH_USER', passwordVariable: 'GH_TOKEN')]) {
        // Construimos la URL de la API de GitHub para actualizar el estado del commit
         def apiUrl = "https://api.github.com/repos/CodiMex360/apollo-frontend/statuses/${env.GIT_COMMIT}"

        // Realizamos la petición HTTP POST para actualizar el estado del commit
        def response = httpRequest(
            acceptType: 'APPLICATION_JSON',
            contentType: 'APPLICATION_JSON',
            httpMode: 'POST',
            url: apiUrl,
            authentication: credentialsId,
            requestBody: """
                {
                    "state": "${state}",
                    "context": "${context}",
                    "description": "${description}",
                    "target_url": "${env.BUILD_URL}"
                }
            """
        )

        echo "🚀 Estado del commit actualizado: ${state}"
    }
}
