import pathLib from 'node:path';

import { expect, test } from '@playwright/test';
import depcheck from 'depcheck';
import endent from 'endent';
import fs from 'fs-extra';

import self from '.';

const tests = [
  endent`
    import packageName from 'depcheck-package-name';

    packageName\`foo\`;
  `,
  endent`
    import packageName from 'depcheck-package-name';

    const bar = 1
    packageName\`foo\${bar}\`;
  `,
  endent`
    import depcheckPackageName from 'depcheck-package-name';

    depcheckPackageName\`foo\`;
  `,
];

for (const [index, testConfig] of tests.entries()) {
  test(String(index), async ({}, testInfo) => {
    const cwd = testInfo.outputPath();
    await fs.outputFile(pathLib.join(cwd, 'src', 'index.ts'), testConfig);

    const result = await depcheck(cwd, {
      detectors: [self],
      package: { dependencies: { foo: '^1.0.0' } },
    });

    expect(result.dependencies).toEqual([]);
  });
}
