import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitTasks1767164012000 implements MigrationInterface {
  name = 'InitTasks1767164012000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const enumExists = await queryRunner.query(
      "SELECT 1 FROM pg_type WHERE typname = 'tasks_status_enum'"
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    if (enumExists.length === 0) {
      await queryRunner.query(
        `CREATE TYPE tasks_status_enum AS ENUM('pending', 'in_progress', 'done')`,
      );
    }

    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id" SERIAL PRIMARY KEY,
        "title" character varying(200) NOT NULL,
        "description" text,
        "status" tasks_status_enum NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "tasks"`);
    await queryRunner.query(`DROP TYPE IF EXISTS tasks_status_enum`);
  }
}
