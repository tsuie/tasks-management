import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedThousandTasks1767166200000 implements MigrationInterface {
  name = 'SeedThousandTasks1767166200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tasks" ("title", "description", "status", "priority", "due_date")
      SELECT
        'Sample Task #' || gs AS title,
        'This is sample task number ' || gs AS description,
        (ARRAY['pending','in_progress','done'])[(gs % 3) + 1]::public.tasks_status_enum AS status,
        (ARRAY['low','medium','high'])[(gs % 3) + 1]::public.tasks_priority_enum AS priority,
        now() + make_interval(days => (gs % 30)) AS due_date
      FROM generate_series(1, 1000) AS gs;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "tasks"
      WHERE "title" LIKE 'Sample Task #%'
        AND "description" LIKE 'This is sample task number %';
    `);
  }
}
