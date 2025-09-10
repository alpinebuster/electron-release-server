module.exports = {
    apps: [{
        name: "as-release-server",
        script: "app.js",
        instances: 1,
        exec_mode: "fork",
        env: {
            NODE_ENV: "production"
        }
    }]
};
