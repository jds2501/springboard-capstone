module.exports = {
    globalTeardown: './jest.teardown.js',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testEnvironment: 'node',
};