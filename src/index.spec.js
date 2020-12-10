import { endent, mapValues } from '@dword-design/functions'
import execa from 'execa'
import outputFiles from 'output-files'
import withLocalTmpDir from 'with-local-tmp-dir'

const runTest = files => () =>
  withLocalTmpDir(async () => {
    await outputFiles({
      'depcheck.config.js': endent`
        const self = require('../src')
        module.exports = {
          detectors: [
            self,
          ],
        }
      `,
      ...files,
    })
    await execa.command('depcheck --config depcheck.config.js')
  })

export default [
  {
    'package.json': endent`
      {
        "dependencies": {
          "foo": "^1.0.0"
        }
      }
    `,
    'src/index.js': endent`
      import packageName from 'depcheck-package-name'

      packageName\`foo\`
    `,
  },
  {
    'package.json': endent`
      {
        "dependencies": {
          "foo": "^1.0.0"
        }
      }
    `,
    'src/index.js': endent`
      import packageName from 'depcheck-package-name'

      const bar = 1
      packageName\`foo\${bar}\`
    `,
  },
  {
    'package.json': endent`
      {
        "dependencies": {
          "foo": "^1.0.0"
        }
      }
    `,
    'src/index.js': endent`
      import depcheckPackageName from 'depcheck-package-name'

      depcheckPackageName\`foo\`
    `,
  },
] |> mapValues(runTest)
