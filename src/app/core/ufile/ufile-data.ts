import {UfileTypes} from './ufile-types';
import {Ufile} from '../../models/ufile';

export interface UfileData {
  targetId: string | number;
  files: Ufile[];
  type: UfileTypes;
}
