import type { SchemaChange, SchemaReport } from './types.js';
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
const obj = (value: Json | undefined): Record<string, Json> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, Json> : {};
export function parseJson(text: string): Json { return JSON.parse(text) as Json; }
export function analyzeSchemas(oldSchema: Json, nextSchema: Json): SchemaReport {
  const changes: SchemaChange[] = [];
  const visit = (oldValue: Json | undefined, nextValue: Json | undefined, path: string) => {
    const oldObj = obj(oldValue); const nextObj = obj(nextValue); const oldProps = obj(oldObj.properties); const nextProps = obj(nextObj.properties);
    for (const key of Object.keys(oldProps)) if (!(key in nextProps)) changes.push({kind:'breaking', rule:'property-removed', path:`${path}.${key}`, message:'Existing property was removed.'});
    const oldRequired = Array.isArray(oldObj.required) ? oldObj.required.filter((x): x is string => typeof x === 'string') : []; const nextRequired = Array.isArray(nextObj.required) ? nextObj.required.filter((x): x is string => typeof x === 'string') : [];
    for (const key of nextRequired) if (!oldRequired.includes(key) && key in oldProps) changes.push({kind:'breaking', rule:'required-added', path:`${path}.${key}`, message:'An optional property became required.'});
    const oldEnum = Array.isArray(oldObj.enum) ? oldObj.enum : []; const nextEnum = Array.isArray(nextObj.enum) ? nextObj.enum : [];
    if (oldEnum.length && nextEnum.length && oldEnum.some(value => !nextEnum.some(item => JSON.stringify(item) === JSON.stringify(value)))) changes.push({kind:'breaking', rule:'enum-narrowed', path, message:'A previously valid enum value is no longer accepted.'});
    if (oldObj.type !== undefined && nextObj.type !== undefined && oldObj.type !== nextObj.type) changes.push({kind:'breaking', rule:'type-changed', path, message:`Type changed from ${String(oldObj.type)} to ${String(nextObj.type)}.`});
    for (const key of Object.keys(nextProps)) if (key in oldProps) visit(oldProps[key], nextProps[key], `${path}.${key}`);
    if (oldObj.deprecated !== true && nextObj.deprecated === true) changes.push({kind:'warning', rule:'deprecated', path, message:'Property is now deprecated.'});
    if (oldValue === undefined && nextValue !== undefined) changes.push({kind:'info', rule:'property-added', path, message:'New property added.'});
  };
  visit(oldSchema, nextSchema, '$'); const breaking = changes.filter(change => change.kind === 'breaking').length; const warnings = changes.filter(change => change.kind === 'warning').length;
  return {changes, breaking, warnings, score: Math.max(0, 100 - breaking * 25 - warnings * 5), verdict: breaking ? 'breaking' : warnings ? 'review' : 'compatible'};
}
export function toMarkdown(report: SchemaReport): string { const lines = [`# Schema Diff Report`, ``, `- Verdict: **${report.verdict}**`, `- Score: **${report.score}/100**`, `- Breaking changes: **${report.breaking}**`, `- Warnings: **${report.warnings}**`, ``]; for (const change of report.changes) lines.push(`- **${change.kind}** \`${change.rule}\` \`${change.path}\`: ${change.message}`); return lines.join('\n'); }
