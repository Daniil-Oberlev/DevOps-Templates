// groovylint-disable FactoryMethodName
String buildImage(String imageName, String dockerfile = 'Dockerfile', String context = '.') {
    String tag = "${imageName}:${env.BUILD_NUMBER}-${utils.shortCommitHash()}"
    sh "docker build -f ${dockerfile} -t ${tag} ${context}"
    return tag
}

String pushImage(String imageTag) {
    sh "docker push ${imageTag}"
    return imageTag
}

void loginToRegistry(String registryUrl, String credentialsId = 'docker-registry-creds') {
    withCredentials([usernamePassword(
        credentialsId: credentialsId,
        usernameVariable: 'REGISTRY_USER',
        passwordVariable: 'REGISTRY_PASSWORD'
    )]) {
        sh "echo \$REGISTRY_PASSWORD | docker login -u \$REGISTRY_USER --password-stdin ${registryUrl}"
    }
}

