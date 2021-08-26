import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  HttpCode,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ResponseDto } from '../../utils/ResponseDto';
import { GetShiftsResponse } from './dto/GetShiftsResponse';
import { GetShiftResponse } from './dto/GetShiftResponse';
import { ShiftService } from './shift.service';
import { ValidationPipe } from '../ValidationPipe';
import { BookTalentRequest } from './dto/BookTalentRequest';

@Controller('shift')
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get(':jobId')
  async getShifts(
    @Param('jobId', new ParseUUIDPipe()) jobId: string,
  ): Promise<ResponseDto<GetShiftsResponse>> {
    const shifts = await this.shiftService.getShifts(jobId);
    return new ResponseDto<GetShiftsResponse>(
      new GetShiftsResponse(
        shifts.map(shift => {
          return new GetShiftResponse(
            shift.id,
            shift.talentId,
            shift.jobId,
            shift.isCancelled,
            shift.startTime,
            shift.endTime,
          );
        }),
      ),
    );
  }

  @Patch(':shiftId/book')
  @HttpCode(204)
  async bookTalent(
    @Param('shiftId', new ParseUUIDPipe()) shiftId: string,
    @Body(new ValidationPipe<BookTalentRequest>()) dto: BookTalentRequest,
  ): Promise<void> {
    this.shiftService.bookTalent(shiftId, dto.talent);
  }

  @Delete(':shiftId')
  async deleteShift(
    @Param('shiftId', new ParseUUIDPipe()) shiftId: string,
  ): Promise<ResponseDto<GetShiftResponse>> {
    const shift = await this.shiftService.cancelShift(shiftId);
    return new ResponseDto<GetShiftResponse>(new GetShiftResponse(
      shift.id,
      shift.talentId,
      shift.jobId,
      shift.isCancelled,
      shift.startTime,
      shift.endTime,
    ));
  }

  @Delete('talent/:talentId')
  async deleteShiftByTalent(
    @Param('talentId', new ParseUUIDPipe()) talentId: string,
  ): Promise<void> {
    this.shiftService.cancelShiftsFromTalent(talentId);
  }
}
