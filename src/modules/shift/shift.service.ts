import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Shift } from './shift.entity';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly repository: Repository<Shift>,
  ) {}

  public async getShifts(jobId: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId,
        isCancelled: false,
      },
    });
  }

  public async bookTalent(talent: string, shiftId: string): Promise<void> {
    this.repository.findOne(shiftId).then(shift => {
      shift.talentId = talent;
      this.repository.save(shift);
    });
  }

  public async cancelShift(shiftId: string): Promise<Shift> {
    const repository = await this.repository.findOne(shiftId);

    return this.repository.save({
      ...repository,
      isCancelled: true,
    });  
  }

  public async cancelShiftsFromTalent(talent: string): Promise<void> {
    const repositories = await this.repository.find({
      where: {
        talentId: talent,
      },
    });

    const currentDate = new Date();

    (async () => {
      for(const repository of repositories) {
        await this.repository.save({
          ...repository,
          isCancelled: true,
          createdAt: currentDate,
        });
      }
    });
  }
}
