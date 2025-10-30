import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

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

  findAll(): Promise<Task[]> {
    return this.repo.find({ order: { id: 'DESC' } });
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

  async remove(id: number): Promise<void> {
    const res = await this.repo.delete(id);
    if (!res.affected) throw new NotFoundException(`Task ${id} not found`);
  }
}
