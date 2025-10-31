import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedThousandTasks1767166200000 implements MigrationInterface {
  name = 'SeedThousandTasks1767166200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "tasks" ("title", "description", "status", "priority", "due_date")
      SELECT
        CASE (gs % 20)
          WHEN 0 THEN 'Write documentation for ' || (ARRAY['API', 'frontend', 'backend', 'database'])[floor(random() * 4 + 1)]
          WHEN 1 THEN 'Fix bug in ' || (ARRAY['authentication', 'user profile', 'dashboard', 'search'])[floor(random() * 4 + 1)]
          WHEN 2 THEN 'Review pull request #' || floor(random() * 1000 + 1)
          WHEN 3 THEN 'Update dependencies for ' || (ARRAY['React', 'NestJS', 'TypeORM', 'PostgreSQL'])[floor(random() * 4 + 1)]
          WHEN 4 THEN 'Implement ' || (ARRAY['user notifications', 'export feature', 'analytics', 'email templates'])[floor(random() * 4 + 1)]
          WHEN 5 THEN 'Design ' || (ARRAY['landing page', 'mobile layout', 'dashboard widgets', 'settings panel'])[floor(random() * 4 + 1)]
          WHEN 6 THEN 'Deploy to ' || (ARRAY['staging', 'production', 'development', 'testing'])[floor(random() * 4 + 1)] || ' environment'
          WHEN 7 THEN 'Refactor ' || (ARRAY['services layer', 'controllers', 'database queries', 'utility functions'])[floor(random() * 4 + 1)]
          WHEN 8 THEN 'Add tests for ' || (ARRAY['authentication', 'task management', 'user service', 'API endpoints'])[floor(random() * 4 + 1)]
          WHEN 9 THEN 'Configure ' || (ARRAY['CI/CD pipeline', 'monitoring', 'logging', 'backup strategy'])[floor(random() * 4 + 1)]
          WHEN 10 THEN 'Investigate ' || (ARRAY['performance issue', 'memory leak', 'slow queries', 'timeout errors'])[floor(random() * 4 + 1)]
          WHEN 11 THEN 'Meeting with ' || (ARRAY['product team', 'stakeholders', 'design team', 'engineering team'])[floor(random() * 4 + 1)]
          WHEN 12 THEN 'Optimize ' || (ARRAY['database indexes', 'API response time', 'bundle size', 'image loading'])[floor(random() * 4 + 1)]
          WHEN 13 THEN 'Create ' || (ARRAY['user onboarding flow', 'admin panel', 'reporting dashboard', 'data migration script'])[floor(random() * 4 + 1)]
          WHEN 14 THEN 'Research ' || (ARRAY['new framework', 'security best practices', 'caching strategies', 'payment gateway'])[floor(random() * 4 + 1)]
          WHEN 15 THEN 'Setup ' || (ARRAY['development environment', 'Docker containers', 'local database', 'SSL certificates'])[floor(random() * 4 + 1)]
          WHEN 16 THEN 'Plan sprint for ' || (ARRAY['Q1 goals', 'new features', 'technical debt', 'performance improvements'])[floor(random() * 4 + 1)]
          WHEN 17 THEN 'Integrate ' || (ARRAY['payment system', 'third-party API', 'analytics tool', 'authentication provider'])[floor(random() * 4 + 1)]
          WHEN 18 THEN 'Prepare ' || (ARRAY['release notes', 'deployment checklist', 'demo presentation', 'training materials'])[floor(random() * 4 + 1)]
          ELSE 'Sample Task #' || gs
        END AS title,
        CASE (gs % 15)
          WHEN 0 THEN 'Need to complete this by end of week. High priority.'
          WHEN 1 THEN 'This task requires coordination with the ' || (ARRAY['frontend', 'backend', 'DevOps', 'QA'])[floor(random() * 4 + 1)] || ' team.'
          WHEN 2 THEN 'Follow up on previous discussion about ' || (ARRAY['architecture', 'implementation', 'timeline', 'requirements'])[floor(random() * 4 + 1)] || '.'
          WHEN 3 THEN 'Blocked by ' || (ARRAY['code review', 'external dependency', 'design approval', 'infrastructure setup'])[floor(random() * 4 + 1)] || '. Need to resolve soon.'
          WHEN 4 THEN 'Estimated time: ' || floor(random() * 8 + 1) || ' hours. Should be straightforward.'
          WHEN 5 THEN 'Related to ticket #' || floor(random() * 500 + 1) || '. Check previous implementation.'
          WHEN 6 THEN 'Customer reported issue. Needs immediate attention and proper testing.'
          WHEN 7 THEN 'Technical improvement to enhance ' || (ARRAY['performance', 'security', 'maintainability', 'scalability'])[floor(random() * 4 + 1)] || '.'
          WHEN 8 THEN 'Draft proposal and gather feedback from team before implementation.'
          WHEN 9 THEN 'Part of ' || (ARRAY['Phase 1 rollout', 'MVP release', 'beta testing', 'migration plan'])[floor(random() * 4 + 1)] || '.'
          WHEN 10 THEN 'Requires ' || (ARRAY['database migration', 'config changes', 'security review', 'load testing'])[floor(random() * 4 + 1)] || ' before going live.'
          WHEN 11 THEN 'Nice to have feature requested by multiple users in feedback survey.'
          WHEN 12 THEN 'Follow best practices and ensure proper documentation is in place.'
          WHEN 13 THEN 'Investigate root cause and implement long-term solution, not just quick fix.'
          ELSE 'This is sample task number ' || gs
        END AS description,
        CASE
          WHEN gs % 7 = 0 THEN 'done'
          WHEN gs % 5 = 0 THEN 'in_progress'
          ELSE 'pending'
        END::public.tasks_status_enum AS status,
        CASE
          WHEN gs % 11 = 0 THEN 'high'
          WHEN gs % 7 = 0 THEN 'low'
          ELSE 'medium'
        END::public.tasks_priority_enum AS priority,
        CASE
          WHEN gs % 4 = 0 THEN now() + make_interval(days => floor(random() * 7 + 1)::int)  -- Due within next week
          WHEN gs % 4 = 1 THEN now() + make_interval(days => floor(random() * 23 + 8)::int) -- Due 1-4 weeks out
          WHEN gs % 4 = 2 THEN now() - make_interval(days => floor(random() * 7 + 1)::int)  -- Overdue
          ELSE now() + make_interval(days => floor(random() * 60 + 31)::int)              -- Due 1-3 months out
        END AS due_date
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
