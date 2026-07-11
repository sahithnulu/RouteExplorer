/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('rides', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        user_id: { type: 'uuid', notNull: true ,references: 'users(id)' },
        started_at: { type: 'timestamp', notNull: true },
        ended_at: { type: 'timestamp' },
        distance_meters: { type: 'float' },
        duration_seconds: { type: 'integer' },
        status: { type: 'varchar(20)', notNull: true, default: 'active' },
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('rides')
};
