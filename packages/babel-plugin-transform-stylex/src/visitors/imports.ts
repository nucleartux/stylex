/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @flow strict
 */

import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';
import StateManager from '../utils/state-manager';
// This is currently just `stylex` but it might become
// `@stylexjs/core` or `@stylexjs/runtime` in the future
import { name } from 'stylex/package.json';

// Read imports of react and remember the name of the local varsiables for later
export function readImportDeclarations(
  path: NodePath<t.ImportDeclaration>,
  state: StateManager
): void {
  const { node } = path;
  if (node?.importKind === 'type' || node?.importKind === 'typeof') {
    return;
  }
  if (node.source.value === 'stylex' || node.source.value === name) {
    for (const specifier of node.specifiers) {
      if (specifier.type === 'ImportDefaultSpecifier') {
        state.stylexImport.add(specifier.local.name);
      }
      if (specifier.type === 'ImportNamespaceSpecifier') {
        state.stylexImport.add(specifier.local.name);
      }
      if (specifier.type === 'ImportSpecifier') {
        if (specifier.imported.type === 'Identifier') {
          if (specifier.imported.name === 'create') {
            state.stylexCreateImport.add(specifier.local.name);
          }
          if (specifier.imported.name === 'keyframes') {
            state.stylexKeyframesImport.add(specifier.local.name);
          }
        }
        if (specifier.imported.type === 'StringLiteral') {
          if (specifier.imported.value === 'create') {
            state.stylexCreateImport.add(specifier.local.name);
          }
          if (specifier.imported.value === 'keyframes') {
            state.stylexKeyframesImport.add(specifier.local.name);
          }
        }
      }
    }
  }
}

// Read require calls and remember the names of the variables for later
export function readRequires(
  path: NodePath<t.VariableDeclarator>,
  state: StateManager
): void {
  const { node } = path;
  if (
    node.init?.type === 'CallExpression' &&
    node.init?.callee?.type === 'Identifier' &&
    node.init?.callee?.name === 'require' &&
    node.init?.arguments?.length === 1 &&
    node.init?.arguments?.[0].type === 'StringLiteral' &&
    (node.init?.arguments?.[0].value === 'stylex' ||
      node.init?.arguments?.[0].value === name)
  ) {
    if (node.id.type === 'Identifier') {
      state.stylexImport.add(node.id.name);
    }
    if (node.id.type === 'ObjectPattern') {
      for (const prop of node.id.properties) {
        if (
          prop.type === 'ObjectProperty' &&
          prop.key.type === 'Identifier' &&
          prop.value.type === 'Identifier'
        ) {
          if (prop.key.name === 'create') {
            state.stylexCreateImport.add(prop.value.name);
          }
          if (prop.key.name === 'keyframes') {
            state.stylexKeyframesImport.add(prop.value.name);
          }
        }
      }
    }
  }
}