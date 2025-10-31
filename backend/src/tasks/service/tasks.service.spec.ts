import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus, TaskPriority } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { QueryTaskDto } from '../dto/query-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;
  let queryBuilder: SelectQueryBuilder<Task>;

  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    dueDate: new Date('2025-12-31'),
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  const mockQueryBuilder = {
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'New Task',
        description: 'New Description',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        dueDate: new Date('2025-12-31'),
      };

      const expectedTask: Task = {
        id: 1,
        ...createTaskDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedTask);
      mockRepository.save.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDto);

      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalledWith(expectedTask);
      expect(result).toEqual(expectedTask);
    });

    it('should create a task with default values when optional fields are missing', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Minimal Task',
      };

      const expectedTask: Task = {
        id: 2,
        title: 'Minimal Task',
        description: null,
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        dueDate: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(expectedTask);
      mockRepository.save.mockResolvedValue(expectedTask);

      const result = await service.create(createTaskDto);

      expect(result.title).toBe('Minimal Task');
      expect(mockRepository.create).toHaveBeenCalledWith(createTaskDto);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    });

    it('should return paginated tasks with default parameters', async () => {
      const queryDto: QueryTaskDto = {};
      const mockTasks = [mockTask];
      const totalCount = 100;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTasks, totalCount]);

      const result = await service.findAll(queryDto);

      expect(result).toEqual({
        data: mockTasks,
        total: totalCount,
        page: 1,
        limit: 10,
        totalPages: 10,
      });
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('task');
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should apply status filter when provided', async () => {
      const queryDto: QueryTaskDto = {
        status: TaskStatus.DONE,
        page: 1,
        limit: 10,
      };
      const mockTasks = [{ ...mockTask, status: TaskStatus.DONE }];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTasks, 1]);

      const result = await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.status = :status',
        { status: TaskStatus.DONE },
      );
      expect(result.data).toEqual(mockTasks);
      expect(result.total).toBe(1);
    });

    it('should apply priority filter when provided', async () => {
      const queryDto: QueryTaskDto = {
        priority: TaskPriority.HIGH,
        page: 1,
        limit: 10,
      };
      const mockTasks = [{ ...mockTask, priority: TaskPriority.HIGH }];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTasks, 1]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'task.priority = :priority',
        { priority: TaskPriority.HIGH },
      );
    });

    it('should apply search filter when provided', async () => {
      const queryDto: QueryTaskDto = {
        search: 'test',
        page: 1,
        limit: 10,
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockTask], 1]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(task.title ILIKE :q OR task.description ILIKE :q)',
        { q: '%test%' },
      );
    });

    it('should calculate totalPages correctly', async () => {
      const queryDto: QueryTaskDto = { page: 1, limit: 10 };
      const totalCount = 25;

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockTask], totalCount]);

      const result = await service.findAll(queryDto);

      expect(result.totalPages).toBe(3); // 25 / 10 = 2.5 -> 3
    });

    it('should handle pagination for page 2', async () => {
      const queryDto: QueryTaskDto = { page: 2, limit: 10 };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockTask], 20]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10); // (2-1) * 10
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should apply sorting by dueDate', async () => {
      const queryDto: QueryTaskDto = {
        sortBy: 'dueDate',
        sortOrder: 'asc',
      };

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockTask], 1]);

      await service.findAll(queryDto);

      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'task.dueDate',
        'ASC',
        'NULLS LAST',
      );
    });
  });

  describe('findOne', () => {
    it('should return a task when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow('Task 999 not found');
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        status: TaskStatus.DONE,
      };

      const updatedTask: Task = {
        ...mockTask,
        ...updateTaskDto,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.title).toBe('Updated Task');
      expect(result.status).toBe(TaskStatus.DONE);
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should partially update a task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        priority: TaskPriority.HIGH,
      };

      const updatedTask: Task = {
        ...mockTask,
        priority: TaskPriority.HIGH,
      };

      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.save.mockResolvedValue(updatedTask);

      const result = await service.update(1, updateTaskDto);

      expect(result.priority).toBe(TaskPriority.HIGH);
      expect(result.title).toBe(mockTask.title); // Should keep original title
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      const result = await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when deleting non-existent task', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      await expect(service.remove(999)).rejects.toThrow('Task 999 not found');
    });

    it('should throw NotFoundException when delete operation fails', async () => {
      mockRepository.findOne.mockResolvedValue(mockTask);
      mockRepository.delete.mockResolvedValue({ affected: 0, raw: {} });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
