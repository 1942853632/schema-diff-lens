export type ChangeKind = 'breaking' | 'warning' | 'info';
export interface SchemaChange { kind: ChangeKind; rule: string; path: string; message: string; }
export interface SchemaReport { changes: SchemaChange[]; breaking: number; warnings: number; score: number; verdict: 'compatible' | 'review' | 'breaking'; }
