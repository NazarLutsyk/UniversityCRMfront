import {Client} from './client';
import {Source} from './source';
import {Course} from './course';
import {Group} from './group';
import {Contract} from './contract';
import {AudioCall} from './audio-call';
import {Payment} from './payment';
import {Lesson} from './lesson';
import {City} from './city';

export class Application {
  constructor(
    public id: number = null,
    public date: string = '',
    public fullPrice: number = 0,
    public discount: number = 0,
    public resultPrice: number = 0,
    public leftToPay: number = 0,
    public wantPractice: boolean = false,
    public hasPractice: boolean = false,
    public client: Client = null,
    public clientId: number = null,
    public course: Course = null,
    public courseId: number = null,
    public group: Group = null,
    public groupId: number = null,
    public city: City = null,
    public cityId: number = null,
    public contract: Contract = null,
    public contractId: number = null,
    public audioCalls: AudioCall[] = [],
    public payments: Payment[] = [],
    public sources: Source[] = [],
    public lessons: Lesson[] = [],
  ) {
  }
}
