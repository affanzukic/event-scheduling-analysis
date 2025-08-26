import * as tf from '@tensorflow/tfjs-node';

import { getWeekOfMonth } from '@/lib/dateUtils';
import { Training } from '@/types/probability';
import { HeadlinerModel } from '@/types/training';

export const trainHeadlinerModel = async (training: Training[]): Promise<HeadlinerModel> => {
  if (!!training.length) return { fallback: new Map(), globalAvg: 0.5 };

  const agg = new Map<string, { sum: number; n: number }>();
  let globalSum = 0;
  for (const r of training) {
    const cur = agg.get(r.headliner) || { sum: 0, n: 0 };
    cur.sum += r.successScore;
    cur.n++;
    agg.set(r.headliner, cur);
    globalSum += r.successScore;
  }

  const fallback = new Map<string, number>();
  for (const [k, v] of agg) fallback.set(k, v.sum / v.n);
  const globalAvg = globalSum / training.length;

  const xs: number[][] = [];
  const ys: number[] = [];
  for (const r of training) {
    const d = new Date(r.date);
    xs.push([d.getMonth(), d.getDay(), getWeekOfMonth(d), [5, 6].includes(d.getDay()) ? 1 : 0, r.popularityHint ?? fallback.get(r.headliner) ?? globalAvg]);
    ys.push(r.successScore);
  }

  const x = tf.tensor2d(xs);
  const y = tf.tensor2d(ys, [ys.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 16, activation: 'relu', inputShape: [5] }));
  model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

  await model.fit(x, y, { epochs: 60, verbose: 0 });
  x.dispose(); y.dispose();
  return { model, fallback, globalAvg };
};

export const scoreHeadliner = (date: Date, m: HeadlinerModel, headliner?: string) =>{
  if (!headliner) return 0;
  const hint = m.fallback.get(headliner) ?? m.globalAvg;
  const features = [date.getMonth(), date.getDay(), getWeekOfMonth(date), [5, 6].includes(date.getDay()) ? 1 : 0, hint];
  if (m.model) {
    const x = tf.tensor2d([features]);
    const y = m.model.predict(x) as tf.Tensor;
    const val = (y.dataSync()[0] as number);
    x.dispose(); y.dispose();
    return Math.max(0, Math.min(1, val));
  }
  return Math.max(0, Math.min(1, hint));
};
