export class GetShiftResponse {
  id: string;
  talentId: string;
  jobId: string;
  isCancelled: boolean;
  start: Date;
  end: Date;

  constructor(
    id: string,
    talentId: string,
    jobId: string,
    isCancelled: boolean,
    start: Date,
    end: Date,
  ) {
    this.id = id;
    this.talentId = talentId;
    this.jobId = jobId;
    this.isCancelled = isCancelled;
    this.start = start;
    this.end = end;
  }
}
