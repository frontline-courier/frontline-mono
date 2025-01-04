import { creditCourier } from './couriers';
import { creditModes } from './mode';
import { creditVolumes } from './volumes';

interface CreditVolumeType {
  courier: typeof creditCourier[number],
  mode: typeof creditModes[number],
  volume: typeof creditVolumes[number],
};

export const creditCourierVolumeMapping: CreditVolumeType[] = [
  {
    courier: 'BLUEDART',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'BLUEDART',
    mode: 'SFC',
    volume: 'LBH/27000*8'
  },
  {
    courier: 'DTDC',
    mode: 'SFC',
    volume: 'LBH/4750'
  },
  {
    courier: 'DTDC',
    mode: 'AIR',
    volume: 'LBH/6000'
  },
  {
    courier: 'FRANCH',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'FRANCH',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'TIRUPATHI',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'TIRUPATHI',
    mode: 'AIR',
    volume: 'LBH/6000'
  },
  {
    courier: 'PROFESSIONAL',
    mode: 'AIR',
    volume: 'LBH/6000'
  },
  {
    courier: 'PROFESSIONAL',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'FEDEX',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'UPS',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'TNT',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'ARAMEX',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'PACIFIC',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'DPEX',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'DPD',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'DELIVERY',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'XPRESSBEE',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'ECOM',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'DOTZOT',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'EKART',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'ST',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'NETWORK',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'ACX',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'SKYEX',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'SKYNET',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'DELIVERY',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'XPRESSBEE',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'ECOM',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'DOTZOT',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'EKART',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'ST',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'XPRESSBEE',
    mode: 'CAR',
    volume: 'LBH/27000*8'
  },
  {
    courier: 'DTDC',
    mode: 'CAR',
    volume: 'LBH/27000*8'
  },
  {
    courier: 'DELIVERY',
    mode: 'CAR',
    volume: 'LBH/27000*8'
  },
  {
    courier: 'PROFESSIONAL',
    mode: 'ACC',
    volume: 'LBH/6000'
  },
  {
    courier: 'DTDC',
    mode: 'ACC',
    volume: 'LBH/6000'
  },
  {
    courier: 'OTHER',
    mode: 'ACC',
    volume: 'LBH/5000'
  },
  {
    courier: 'OTHER',
    mode: 'AIR',
    volume: 'LBH/5000'
  },
  {
    courier: 'OTHER',
    mode: 'SFC',
    volume: 'LBH/5000'
  },
  {
    courier: 'BLUEDART',
    mode: 'ECO',
    volume: 'LBH/27000*8'
  },
  {
    courier: 'LOGISTICS',
    mode: 'ECO',
    volume: 'LBH/27000*8'
  }
];
