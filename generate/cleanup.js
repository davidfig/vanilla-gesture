const fs = require('fs-extra')

async function cleanup() {
    console.log('cleaning up docs/ directory...')
    await fs.emptyDir('docs')
}

cleanup()