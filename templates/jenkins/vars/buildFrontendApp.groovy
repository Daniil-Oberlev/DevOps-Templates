void call(Map<String, Object> config = [:]) {
    Map<String, Object> defaults = [
        nodeVersion: '18',
        buildScript: 'run build',
        installArgs: ''
    ]

    Map<String, Object> effectiveConfig = defaults + config

    nodejs(config.nodeVersion) {
        stage('Install Dependencies') {
            bat "npm install ${effectiveConfig.installArgs}"
        }
        stage('Build Project') {
            bat "npm ${effectiveConfig.buildScript}"
        }
    }
}
