import { creditVolumes } from '../../constants/credit/volumes';

export const volumeWeightCalculation = (formulae: typeof creditVolumes[number], l: number, b: number, h: number) => {
  let weight = 0;

  switch (formulae) {
    case 'LBH/27000*8':
      weight = ((l * b * h) / 2700) * 8;
      break;
    case 'LBH/4750':
      weight = (l * b * h) / 4750;
      break;
    case 'LBH/5000':
      weight = (l * b * h) / 5000;
      break;
    case 'LBH/6000':
      weight = (l * b * h) / 6000;
      break;
    default:
      weight = 0;
  }

  return Math.round(weight * 100) / 100;
}
