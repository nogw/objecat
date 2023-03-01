import { StmtExpression } from './StmtExpression';
import { StmtVariable } from './StmtVariable';
import { StmtFunction } from './StmtFunction';
import { StmtReturn } from './StmtReturn';
import { StmtBlock } from './StmtBlock';
import { StmtClass } from './StmtClass';
import { StmtIf } from './StmtIf';

import { ExprVariable } from './ExprVariable';
import { ExprBoolean } from './ExprBoolean';
import { ExprInteger } from './ExprInteger';
import { ExprLogical } from './ExprLogical';
import { ExprBinary } from './ExprBinary';
import { ExprUnary } from './ExprUnary';
import { ExprGet } from './ExprGet';
import { ExprSet } from './ExprSet';
import { ExprAssign } from './ExprAssign';
import { ExprGrouping } from './ExprGrouping';
import { ExprCall } from './ExprCall';
import { ExprSuper } from './ExprSuper';
import { ExprSelf } from './ExprSelf';

export type Expression =
  | ExprGrouping
  | ExprVariable
  | ExprBoolean
  | ExprInteger
  | ExprLogical
  | ExprBinary
  | ExprAssign
  | ExprUnary
  | ExprSuper
  | ExprCall
  | ExprSelf
  | ExprGet
  | ExprSet;

export type Statement =
  | StmtExpression
  | StmtVariable
  | StmtFunction
  | StmtReturn
  | StmtClass
  | StmtBlock
  | StmtIf;
