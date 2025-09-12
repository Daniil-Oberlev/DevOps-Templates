void call(Map<String, Object> config = [:]) {
    Map<String, Object> defaults = [
        nodeVersion: '18',
        buildScript: 'build',
        installArgs: '',
        packageManager: 'npm'
    ]

    Map<String, Object> effectiveConfig = defaults + config

    nodejs(effectiveConfig.nodeVersion) {
        stage('Install Dependencies') {
            executeCommand(getInstallCommand(effectiveConfig))
        }
        stage('Build Project') {
            executeCommand(getBuildCommand(effectiveConfig))
        }
    }
}

private String getInstallCommand(Map config) {
    Map commands = [
        'npm': "npm install ${config.installArgs}",
        'yarn': "yarn install ${config.installArgs}",
        'pnpm': "pnpm install ${config.installArgs}"
    ]
    return commands[config.packageManager].trim()
}

private String getBuildCommand(Map config) {
    Map commands = [
        'npm': "npm run ${config.buildScript}",
        'yarn': "yarn ${config.buildScript}",
        'pnpm': "pnpm run ${config.buildScript}"
    ]
    return commands[config.packageManager]
}

private void executeCommand(String command) {
    /* groovylint-disable-next-line UnnecessaryGetter */
    if (isUnix()) {
        sh command
    } else {
        bat command
    }
}
