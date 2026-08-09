import type { DatabaseSync } from "node:sqlite";

export type DatabaseValue = string | number | bigint | null | Uint8Array;
export type QueryParameters = readonly DatabaseValue[];

export type ExecuteResult = {
  changes: number;
  lastInsertRowid: number | bigint;
};

/** Driver-neutral, asynchronous boundary used by application repositories. */
export interface Database {
  queryOne<Row>(sql: string, parameters?: QueryParameters): Promise<Row | undefined>;
  queryMany<Row>(sql: string, parameters?: QueryParameters): Promise<Row[]>;
  execute(sql: string, parameters?: QueryParameters): Promise<ExecuteResult>;
  executeScript(sql: string): Promise<void>;
  transaction<Result>(work: (database: Database) => Promise<Result>): Promise<Result>;
  tableExists(tableName: string): Promise<boolean>;
}

function bind(parameters: QueryParameters) {
  return parameters as DatabaseValue[];
}

/**
 * Promise-based adapter around the existing SQLite runtime. Keeping the
 * synchronous driver behind this class lets repositories become async now
 * and allows a PostgreSQL pool adapter to replace it without changing them.
 */
export class SqliteDatabase implements Database {
  private operationTail: Promise<void> = Promise.resolve();

  constructor(private readonly sqlite: DatabaseSync) {}

  private enqueue<Result>(operation: () => Promise<Result> | Result): Promise<Result> {
    const result = this.operationTail.then(operation, operation);
    this.operationTail = result.then(() => undefined, () => undefined);
    return result;
  }

  private queryOneDirect<Row>(sql: string, parameters: QueryParameters = []): Row | undefined {
    const statement = this.sqlite.prepare(sql);
    return statement.get(...bind(parameters)) as Row | undefined;
  }

  private queryManyDirect<Row>(sql: string, parameters: QueryParameters = []): Row[] {
    const statement = this.sqlite.prepare(sql);
    return statement.all(...bind(parameters)) as Row[];
  }

  private executeDirect(sql: string, parameters: QueryParameters = []): ExecuteResult {
    const statement = this.sqlite.prepare(sql);
    const result = statement.run(...bind(parameters));
    return { changes: Number(result.changes), lastInsertRowid: result.lastInsertRowid };
  }

  private executeScriptDirect(sql: string): void {
    this.sqlite.exec(sql);
  }

  queryOne<Row>(sql: string, parameters: QueryParameters = []): Promise<Row | undefined> {
    return this.enqueue(() => this.queryOneDirect<Row>(sql, parameters));
  }

  queryMany<Row>(sql: string, parameters: QueryParameters = []): Promise<Row[]> {
    return this.enqueue(() => this.queryManyDirect<Row>(sql, parameters));
  }

  execute(sql: string, parameters: QueryParameters = []): Promise<ExecuteResult> {
    return this.enqueue(() => this.executeDirect(sql, parameters));
  }

  executeScript(sql: string): Promise<void> {
    return this.enqueue(() => this.executeScriptDirect(sql));
  }

  async transaction<Result>(work: (database: Database) => Promise<Result>): Promise<Result> {
    return this.enqueue(async () => {
      const transactionDatabase: Database = {
        queryOne: async <Row>(sql: string, parameters: QueryParameters = []) =>
          this.queryOneDirect<Row>(sql, parameters),
        queryMany: async <Row>(sql: string, parameters: QueryParameters = []) =>
          this.queryManyDirect<Row>(sql, parameters),
        execute: async (sql: string, parameters: QueryParameters = []) =>
          this.executeDirect(sql, parameters),
        executeScript: async (sql: string) => this.executeScriptDirect(sql),
        transaction: async () => { throw new Error("Nested transactions are not supported."); },
        tableExists: async (tableName: string) => Boolean(this.queryOneDirect(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName]
        )),
      };
      this.sqlite.exec("BEGIN IMMEDIATE");
      try {
        const result = await work(transactionDatabase);
        this.sqlite.exec("COMMIT");
        return result;
      } catch (error) {
        this.sqlite.exec("ROLLBACK");
        throw error;
      }
    });
  }

  async tableExists(tableName: string): Promise<boolean> {
    const row = await this.queryOne<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?",
      [tableName]
    );
    return row?.name === tableName;
  }
}
