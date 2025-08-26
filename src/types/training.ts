import { LayersModel } from '@tensorflow/tfjs-node';

export type HeadlinerModel = {
  model?: LayersModel;
  fallback: Map<string, number>;
  globalAvg: number
}
