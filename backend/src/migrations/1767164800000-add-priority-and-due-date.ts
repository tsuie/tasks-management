import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriorityAndDueDate1767164800000 implements MigrationInterface {
  name = 'AddPriorityAndDueDate1767164800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const enumExists = await queryRunner.query(
      "SELECT 1 FROM pg_type WHERE typname = 'tasks_priority_enum'",
    );
    if (enumExists.length === 0) {
      await queryRunner.query(
        `CREATE TYPE "tasks_priority_enum" AS ENUM('low', 'medium', 'high')`,
      );
    }
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "priority" "tasks_priority_enum" NOT NULL DEFAULT 'medium'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD "due_date" TIMESTAMP NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "due_date"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "priority"`);
    await queryRunner.query(
      `DROP TYPE IF EXISTS "tasks_priority_enum"`,
    );
  }
}
