/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';
import type {
  RuleResponse,
  Variables,
  RuleCheck,
} from '../stylex-valid-styles';
import * as ESTree from 'estree';
import makeVariableCheckingRule from '../utils/makeVariableCheckingRule';

export default function makeUnionRule(...rules: RuleCheck[]): RuleCheck {
  return (node: ESTree.Expression, variables?: Variables): RuleResponse => {
    const failedRules = [];
    for (const rule of rules) {
      const check = rule(node, variables);
      if (check === undefined) {
        // passes, that means we pass.
        return undefined;
      }
      failedRules.push(check);
    }
    const fixable = failedRules.filter((a) => a.suggest !== undefined);
    fixable.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    return {
      message: failedRules.map((a) => a.message).join('\n'),
      suggest: fixable[0] != null ? fixable[0].suggest : undefined,
    };
  };
}