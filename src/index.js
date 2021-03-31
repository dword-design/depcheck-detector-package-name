let packageName

export default node => {
  switch (node.type) {
    case 'Program':
      packageName = undefined
      break
    case 'ImportDeclaration':
      if (node.source.value === 'depcheck-package-name') {
        packageName = node.specifiers[0].local.name
      }
      break
    case 'TaggedTemplateExpression':
      if (packageName !== undefined && node.tag.name === packageName) {
        return [node.quasi.quasis[0].value.raw]
      }
      break
    default:
      break
  }

  return []
}
