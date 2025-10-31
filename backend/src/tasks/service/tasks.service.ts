import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create(dto);
    return this.repo.save(task);
  }

  async findAll(
    query: QueryTaskDto,
  ): Promise<{
    data: Task[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;
    const sortBy = query?.sortBy;
    const sortOrder: 'ASC' | 'DESC' =
      (query?.sortOrder?.toUpperCase?.() as 'ASC' | 'DESC') || 'DESC';

    const qb = this.repo.createQueryBuilder('task');

    if (query?.status) {
      qb.andWhere('task.status = :status', { status: query.status });
    }
    if (query?.priority) {
      qb.andWhere('task.priority = :priority', { priority: query.priority });
    }
    if (query?.search) {
      qb.andWhere('(task.title ILIKE :q OR task.description ILIKE :q)', {
        q: `%${query.search}%`,
      });
    }

    if (sortBy === 'dueDate') {
      qb.orderBy('task.dueDate', sortOrder, 'NULLS LAST');
    } else if (sortBy === 'createdAt') {
      qb.orderBy('task.createdAt', sortOrder);
    } else if (sortBy === 'priority') {
      qb.orderBy('task.priority', sortOrder);
    } else {
      qb.orderBy('task.id', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [data, total] = await qb.getManyAndCount();
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.repo.findOne({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: number): Promise<Task> {
    const removedTask = await this.findOne(id);
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Task ${id} not found`);
    return removedTask;
  }
}
