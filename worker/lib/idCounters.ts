export type CounterEntity = 'PATIENT' | 'STAFF' | 'INVOICE' | 'EXPENSE';

const PREFIXES: Record<CounterEntity, string> = {
  PATIENT: 'LTM',
  STAFF: 'LTM-STF',
  INVOICE: 'LTM-INV',
  EXPENSE: 'LTM-EXP',
};

export async function nextFormattedId(db: D1Database, entity: CounterEntity): Promise<string> {
  const year = new Date().getFullYear();

  await db
    .prepare('INSERT OR IGNORE INTO id_counters (entity, year, last_seq) VALUES (?, ?, 0)')
    .bind(entity, year)
    .run();

  const result = await db
    .prepare(
      'UPDATE id_counters SET last_seq = last_seq + 1 WHERE entity = ? AND year = ? RETURNING last_seq'
    )
    .bind(entity, year)
    .first<{ last_seq: number }>();

  const seq = result?.last_seq ?? 1;
  return `${PREFIXES[entity]}-${year}-${String(seq).padStart(5, '0')}`;
}
