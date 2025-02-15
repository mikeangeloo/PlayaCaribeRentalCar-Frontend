pipeline {
    agent any

    environment {
        DOCKER_REPO = "miusuario/apollo-frontend"
        BRANCH_NAME = env.BRANCH_NAME
        BUILD_VERSION = "${env.BUILD_NUMBER}"
        PACKAGE_VERSION = ''
        IMAGE_TAG = ''
        EKS_NAMESPACE = "pruebas"  // Espacio de nombres efímero
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "📥 Clonando código de ${BRANCH_NAME}"
                }
            }
        }

        stage('Obtener versión del package.json') {
            steps {
                script {
                    PACKAGE_VERSION = sh(script: "jq -r .version package.json", returnStdout: true).trim()
                    IMAGE_TAG = "${DOCKER_REPO}:${PACKAGE_VERSION}-${BUILD_VERSION}-${BRANCH_NAME}"
                }
            }
        }

        stage('Ejecutar pruebas unitarias') {
            steps {
                script {
                    sh 'npm install'
                    sh 'npm run test -- --coverage'

                    def coverage = sh(script: "node -e \"console.log(require('./coverage/coverage-summary.json').total.statements.pct)\"", returnStdout: true).trim()
                    if (coverage.toInteger() < 80) {
                        error "🚨 Cobertura menor al 80%"
                    }
                }
            }
        }

        stage('Análisis con SonarQube') {
            steps {
                script {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('Construir y publicar imagen Docker') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_TAG} ."
                    sh "docker tag ${IMAGE_TAG} ${DOCKER_REPO}:${PACKAGE_VERSION}"
                    withDockerRegistry([credentialsId: 'docker-hub-cred']) {
                        sh "docker push ${IMAGE_TAG}"
                        sh "docker push ${DOCKER_REPO}:${PACKAGE_VERSION}"
                    }
                }
            }
        }

        stage('Desplegar entorno efímero en EKS') {
            steps {
                script {
                    echo "🚀 Creando entorno efímero en Kubernetes"
                    sh "./deploy_eks_ephemeral.sh ${EKS_NAMESPACE} ${IMAGE_TAG}"
                }
            }
        }

        // stage('Ejecutar pruebas E2E en entorno efímero') {
        //     steps {
        //         script {
        //             echo "🔍 Ejecutando pruebas E2E en el entorno efímero"
        //             sh "./run_e2e_tests.sh ${EKS_NAMESPACE}"
        //         }
        //     }
        // }

        // stage('Eliminar entorno efímero si pruebas E2E fallan') {
        //     when { failure() }
        //     steps {
        //         script {
        //             echo "⚠️ Eliminando entorno efímero en Kubernetes debido a fallas en E2E"
        //             sh "./delete_eks_ephemeral.sh ${EKS_NAMESPACE}"
        //             error "❌ Pruebas E2E fallidas, eliminando el entorno efímero."
        //         }
        //     }
        // }

        // stage('Desplegar en entorno de desarrollo') {
        //     when { success() }
        //     steps {
        //         script {
        //             echo "✅ Pruebas E2E aprobadas, desplegando en entorno de desarrollo"
        //             sh "./deploy_to_dev.sh ${IMAGE_TAG}"
        //         }
        //     }
        // }
    }

    // post {
    //     always {
    //         script {
    //             echo "🧹 Limpiando recursos temporales..."
    //             sh "docker system prune -f"
    //         }
    //     }
    // }
}
