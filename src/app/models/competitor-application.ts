import {Competitor} from './competitor';
import {Client} from './client';

export class CompetitorApplication {

  constructor(
    public id: number = null,
    public date: string = '',
    public competitorId: number = null,
    public competitor: Competitor = null,
    public clientId: number = null,
    public client: Client = null,
  ) {
  }
}
