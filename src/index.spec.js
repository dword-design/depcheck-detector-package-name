import { endent, mapValues } from '@dword-design/functions'
import depcheck from 'depcheck'
import { outputFile } from 'fs-extra'
import P from 'path'
import withLocalTmpDir from 'with-local-tmp-dir'

import self from './index.js'

const runTest = test => () =>
  withLocalTmpDir(async () => {
    await outputFile(P.join('src', 'index.js'), test)

    const result = await depcheck('.', {
      detectors: [self],
      package: {
        dependencies: {
          foo: '^1.0.0',
        },
      },
    })
    expect(result.dependencies).toEqual([])
  })

export default [
  endent`
    import packageName from 'depcheck-package-name'

    packageName\`foo\`
  `,
  endent`
    import packageName from 'depcheck-package-name'

    const bar = 1
    packageName\`foo\${bar}\`
  `,
  endent`
    import depcheckPackageName from 'depcheck-package-name'

    depcheckPackageName\`foo\`
  `,
] |> mapValues(runTest)
