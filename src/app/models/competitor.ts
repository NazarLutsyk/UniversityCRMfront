import {CompetitorApplication} from './competitor-application';

export class Competitor {

  constructor(
    public id: number = null,
    public name: string = '',
    public competitorApplications: CompetitorApplication[] = []
  ) {
  }
}
