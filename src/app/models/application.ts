import {Client} from './client';
import {Source} from './source';
import {Course} from './course';
import {Group} from './group';
import {Contract} from './contract';
import {AudioCall} from './audio-call';
import {Payment} from './payment';
import {Lesson} from './lesson';

export class Application {
  constructor(
    public id: number = null,
    public date: string = '',
    public fullPrice: number = 0,
    public discount: number = 0,
    public resultPrice: number = 0,
    public leftToPay: number = 0,
    public client: Client = null,
    public source: Source = null,
    public course: Course = null,
    public group: Group = null,
    public contract: Contract = null,
    public audioCalls: AudioCall[] = [],
    public payments: Payment[] = [],
    public lessons: Lesson[] = [],
  ) {
  }
}
