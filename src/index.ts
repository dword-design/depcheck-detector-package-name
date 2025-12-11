import type { Node } from 'depcheck';

let packageName: string | null = null;

export default (node: Node) => {
  switch (node.type) {
    case 'Program': {
      packageName = null;
      break;
    }

    case 'ImportDeclaration': {
      if (node.source.value === 'depcheck-package-name') {
        packageName = node.specifiers[0].local.name;
      }

      break;
    }

    case 'TaggedTemplateExpression': {
      if (packageName && node.tag.name === packageName) {
        return [node.quasi.quasis[0].value.raw];
      }

      break;
    }

    default: {
      break;
    }
  }

  return [];
};
