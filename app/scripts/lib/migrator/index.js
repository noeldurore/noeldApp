import EventEmitter from 'events';
import log from 'loglevel';

/**
 * @typedef {object} Migration
 * @property {number} version - The migration version
 * @property {Function} migrate - Returns a promise of the migrated data
 */

/**
 * @typedef {object} MigratorOptions
 * @property {Array<Migration>} [migrations] - The list of migrations to apply
 * @property {number} [defaultVersion] - The version to use in the initial state
 */

export default class Migrator extends EventEmitter {
  constructor(opts = {}) {
    super();
    const migrations = (opts.migrations || []).sort((a, b) => a.version - b.version);
    const lastMigration = migrations[migrations.length - 1];
    this.defaultVersion = opts.defaultVersion || (lastMigration && lastMigration.version) || 0;
    this.migrations = migrations;
  }

  async migrateData(versionedData = this.generateInitialState()) {
    const pendingMigrations = this.migrations.filter(migration => migration.version > versionedData.meta.version);

    for (const migration of pendingMigrations) {
      try {
        log.info(`Running migration ${migration.version}...`);
        const migratedData = await migration.migrate(versionedData);
        if (!migratedData.data) {
          throw new Error('Migrator - migration returned empty data');
        }
        if (migratedData.version !== undefined && migratedData.meta.version !== migration.version) {
          throw new Error('Migrator - Migration did not update version number correctly');
        }
        versionedData = migratedData;
        log.info(`Migration ${migration.version} complete`);
      } catch (err) {
        err.message = `noeldApp Migration Error #${migration.version}: ${err.message}`;
        this.emit('error', err);
        return versionedData;
      }
    }
    return versionedData;
  }

  generateInitialState(data) {
    return {
      data,
      meta: {
        version: this.defaultVersion,
      },
    };
  }
}
