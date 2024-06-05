// tracking mode 1 - frontline, 2 - direct courier website, 3 - api call
export const courierLists = [
  {
    CourierId: 1,
    Courier: 'DTDC Normal',
    Description: 'Normal / Express domestic / Normal International',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 2,
    Courier: 'FEDEX Express',
    Description: 'Priority International',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 3,
    Courier: 'DHL Express',
    Description: 'Express International',
    Track: 'https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 5,
    Courier: 'FRONTLINE Normal',
    Description: 'Normal courier / Same day',
    Track: 'http://www.frontlinecourier.com',
    Status: 1
  },
  {
    CourierId: 7,
    Courier: 'UPS Priority',
    Description: 'Priority International',
    Track: 'https://www.ups.com/track?track=yes&trackNums=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 8,
    Courier: 'TNT Priority',
    Description: 'Priority International',
    Track: 'www.tnt.com/express/en_in/site/home.html',
    Status: 1
  },
  {
    CourierId: 9,
    Courier: 'ARAMEX Priority',
    Description: 'Normal courier',
    Track: 'https://www.aramex.com/in/en/track/track-results-new?type=EXP&ShipmentNumber=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 10,
    Courier: 'NETWORK Normal',
    Description: 'Network Express',
    Track: 'https://www.networkcourier.com.sg/3DWEBSITE/index.aspx',
    Status: 1
  },
  {
    CourierId: 11,
    Courier: 'DPEX Normal',
    Description: 'Normal International',
    Track: 'www.dpex.com',
    Status: 1
  },
  {
    CourierId: 12,
    Courier: 'FRANCH Normal',
    Description: 'Normal courier',
    Track: 'www.franchexpress.com',
    Status: 1
  },
  {
    CourierId: 13,
    Courier: 'BlueDart DP Express',
    Description: 'Express Domestic',
    Track: 'www.bluedart.com',
    Mode: 3,
    Status: 1
  },
  {
    CourierId: 14,
    Courier: 'TCI EXPRESS',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.tciexpress.in',
    Status: 1
  },
  {
    CourierId: 15,
    Courier: 'GATI Normal',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.gati.com',
    Status: 1
  },
  {
    CourierId: 17,
    Courier: 'ST Normal',
    Description: 'Normal courier',
    Track: 'www.stcourier.com',
    Status: 1
  },
  {
    CourierId: 18,
    Courier: 'LINEX',
    Description: 'Normal International',
    Track: 'http://www.linexsolutions.com/',
    Status: 1
  },
  {
    CourierId: 19,
    Courier: 'PROFESSIONAL Normal',
    Description: 'Normal / Express domestic Normal International',
    Track: 'https://www.tpcindia.com/track-info.aspx?id=<AWB>&type=0&service=0',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 20,
    Courier: 'OVERNITE Normal',
    Description: 'Normal courier',
    Track: 'http://www.overnitenet.com/',
    Status: 0
  },
  {
    CourierId: 21,
    Courier: 'BlueDart TDD 10.30 / 12.00',
    Description: 'Morning delivery 10.30 / 12.00',
    Track: 'www.bluedart.com',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 22,
    Courier: 'BlueDart Critical',
    Description: 'Passport  / Critical shipments',
    Track: 'www.bluedart.com',
    Mode: 3,
    Status: 1
  },
  {
    CourierId: 23,
    Courier: 'BlueDart Apex',
    Description: 'Air mode only',
    Track: 'www.bluedart.com',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 24,
    Courier: 'BlueDart Surfaceline',
    Description: 'Surface mode only',
    Track: 'www.bluedart.com',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 27,
    Courier: 'FEDEX Priority Domestic',
    Description: 'Priority / Economy mode domestic',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 30,
    Courier: 'ARAMEX Normal',
    Description: 'Normal International',
    Track: 'https://www.aramex.com/in/en/track/track-results-new?ShipmentNumber=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 31,
    Courier: 'ARAMEX Express',
    Description: 'Normal Express',
    Track: 'https://www.aramex.com/in/en/track/track-results-new?type=EXP&ShipmentNumber=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 32,
    Courier: 'TRACKON Normal',
    Description: '',
    Track: 'www.trackoncourier.com',
    Status: 0
  },
  {
    CourierId: 33,
    Courier: 'CO COURIER',
    Description: '',
    Track: '',
    Status: 0
  },
  {
    CourierId: 35,
    Courier: 'FRONTLINE Priority',
    Description: '',
    Track: 'http://www.frontlinecourier.com',
    Status: 0
  },
  {
    CourierId: 38,
    Courier: 'OVERNITE Priority',
    Description: '',
    Track: 'http://www.overnitenet.com/',
    Status: 0
  },
  {
    CourierId: 41,
    Courier: 'DTDC Priority',
    Description: '',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 0
  },
  {
    CourierId: 42,
    Courier: 'DTDC PTP 12.00',
    Description: '',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 0
  },
  {
    CourierId: 43,
    Courier: 'DTDC PTP 14.00',
    Description: '',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 0
  },
  {
    CourierId: 44,
    Courier: 'DTDC PTP 16.00',
    Description: '',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 0
  },
  {
    CourierId: 45,
    Courier: 'DTDC Sunday',
    Description: '',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 0
  },
  {
    CourierId: 46,
    Courier: 'FRANCH Safty Plus',
    Description: '',
    Track: 'www.franchexpress.com',
    Status: 0
  },
  {
    CourierId: 47,
    Courier: 'TOTAL Normal',
    Description: '',
    Track: '',
    Status: 0
  },
  {
    CourierId: 50,
    Courier: 'ELITEAIRBORNE Normal',
    Description: '',
    Track: 'https://www.eliteairborne.com',
    Status: 1
  },
  {
    CourierId: 51,
    Courier: 'BDHL EXPRESS',
    Description: '',
    Track: 'https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 52,
    Courier: 'OVERNITE mobile',
    Description: '',
    Track: 'http://www.overnitenet.com/',
    Status: 0
  },
  {
    CourierId: 53,
    Courier: 'OVERNITE Passport',
    Description: '',
    Track: 'http://www.overnitenet.com/',
    Status: 0
  },
  {
    CourierId: 54,
    Courier: 'PRIME TRACK Priority',
    Description: '',
    Track: 'http://www.primetrack.in/',
    Status: 0
  },
  {
    CourierId: 56,
    Courier: 'SPOTON Logistics',
    Description: '',
    Track: 'www.spoton.co.in',
    Status: 0
  },
  {
    CourierId: 57,
    Courier: 'CITY LINK Normal',
    Description: '',
    Track: 'http://www.citylinkexpress.com/',
    Status: 0
  },
  {
    CourierId: 58,
    Courier: 'ST Priority',
    Description: '',
    Track: 'www.stcourier.com',
    Status: 0
  },
  {
    CourierId: 59,
    Courier: 'DHL Economy',
    Description: '',
    Track: 'https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 60,
    Courier: 'BlueDart - Apex - Fr',
    Description: '',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 61,
    Courier: 'YOUNGKNIGHT Normal',
    Description: '',
    Track: 'https://youngknightexpress.com/in/tracking',
    Status: 0
  },
  {
    CourierId: 62,
    Courier: 'SHREE TIRUPATHI Normal',
    Description: '',
    Track: 'http://www.shreetirupaticourier.net/Frm_DocTrack.aspx?docno=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 63,
    Courier: 'BlueDart Apex Economy',
    Description: '',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 64,
    Courier: 'Frontline Priority 2.00 Pm',
    Description: '',
    Track: '',
    Status: 0
  },
  {
    CourierId: 65,
    Courier: 'FEDEX Normal Road',
    Description: '',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 66,
    Courier: 'FEDEX Economy Domestic',
    Description: '',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 67,
    Courier: 'Speed & Safe Courier',
    Description: '',
    Track: 'http://www.speedandsafe.com',
    Status: 0
  },
  {
    CourierId: 68,
    Courier: 'Atlantic International Courier',
    Description: '',
    Track: 'https://atlanticcourier.net',
    Status: 0
  },
  {
    CourierId: 69,
    Courier: 'Frontline Sunday Express',
    Description: '',
    Track: 'www.frontlinecourier.com',
    Status: 1
  },
  {
    CourierId: 70,
    Courier: 'FEDEX Intl Economy',
    Description: '',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 71,
    Courier: 'BDHL Priority',
    Description: '',
    Track: 'https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 72,
    Courier: 'Delhivery',
    Description: 'www.delhivery.com',
    Track: 'https://www.delhivery.com/track/package/<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 73,
    Courier: 'UPS Express',
    Description: '',
    Track: 'https://www.ups.com/track?track=yes&trackNums=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 74,
    Courier: 'BlueDart DP Economy',
    Description: '',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 1
  },
  {
    CourierId: 75,
    Courier: 'SkyNet - Economy',
    Description: '',
    Track: 'https://www.skynetworldwide.com/',
    Status: 0
  },
  {
    CourierId: 76,
    Courier: 'BLUEDART INTL ECONOMY',
    Description: '',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 0
  },
  {
    CourierId: 77,
    Courier: 'UPS Economy',
    Description: '',
    Track: 'https://www.ups.com/track?track=yes&trackNums=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 78,
    Courier: 'Delhivery - Priority',
    Description: '',
    Track: 'https://www.delhivery.com/track/package/<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 79,
    Courier: 'Xpressbees - Normal',
    Description: '',
    Track: 'https://www.xpressbees.com/',
    Status: 0
  },
  {
    CourierId: 80,
    Courier: 'Xpressbees - Cargo',
    Description: '',
    Track: 'https://www.xpressbees.com/',
    Status: 0
  },
  {
    CourierId: 81,
    Courier: 'Xpressbees - Priority',
    Description: '',
    Track: 'https://www.xpressbees.com/',
    Status: 0
  },
  {
    CourierId: 82,
    Courier: 'Rivigo Cargo',
    Description: '',
    Track: 'https://www.rivigo.com/',
    Status: 0
  },
  {
    CourierId: 83,
    Courier: 'Rivigo Priority',
    Description: '',
    Track: 'https://www.rivigo.com/',
    Status: 0
  },
  {
    CourierId: 84,
    Courier: 'Frontline Express',
    Description: '',
    Track: '',
    Status: 0
  },
  {
    CourierId: 85,
    Courier: 'Frontline Economy',
    Description: '',
    Track: '',
    Status: 0
  },
  {
    CourierId: 86,
    Courier: 'Network Express',
    Description: 'Network Express',
    Track: 'https://www.networkcourier.com.sg/3DWEBSITE/index.aspx',
    Status: 1
  },
  {
    CourierId: 87,
    Courier: 'BlueDart Intl Economy',
    Description: 'BlueDart',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 1
  },
  {
    CourierId: 88,
    Courier: 'BlueDart Intl Express',
    Description: 'BlueDart',
    Track: 'https://www.bluedart.com/',
    Mode: 3,
    Status: 1
  },
  {
    CourierId: 90,
    Courier: 'ACX Economy',
    Description: 'ACX Economy',
    Track: '',
    Status: 1
  },
  {
    CourierId: 91,
    Courier: 'ACX Express',
    Description: 'ACX Express',
    Track: '',
    Status: 1
  },
  {
    CourierId: 92,
    Courier: 'Nandan Courier Normal',
    Description: 'Nandan Courier Normaly',
    Track: '',
    Status: 1
  },
  {
    CourierId: 93,
    Courier: 'Nandan Courier Priority',
    Description: 'Nandan Courier Priority',
    Track: '',
    Status: 1
  },
  {
    CourierId: 94,
    Courier: 'Bombino Express',
    Description: 'Bombino Express',
    Track: '',
    Status: 1
  },
  {
    CourierId: 95,
    Courier: 'Bombino Economy',
    Description: 'Bombino Economy',
    Track: '',
    Status: 1
  },
  {
    CourierId: 96,
    Courier: 'DPD Express',
    Description: 'DPD Express',
    Track: '',
    Status: 1
  },
  {
    CourierId: 97,
    Courier: 'DPD Economy',
    Description: 'DPD Economy',
    Track: '',
    Status: 1
  },
  {
    CourierId: 98,
    Courier: 'Shree Maruthi Normal',
    Description: 'Shree Maruthi Normal',
    Track: '',
    Status: 1
  },
  {
    CourierId: 99,
    Courier: 'Shree Maruthi Priority',
    Description: 'Shree Maruthi Priority',
    Track: '',
    Status: 1
  },
  {
    CourierId: 100,
    Courier: 'Dotzot Normal',
    Description: 'Dotzot Normal',
    Track: 'https://dotzot.in/',
    Status: 1
  },
  {
    CourierId: 101,
    Courier: 'Amazon Normal',
    Description: 'Amazon Normal',
    Track: 'https://track.amazon.in/',
    Status: 1
  },
  {
    CourierId: 102,
    Courier: 'PXC Pacific Global',
    Description: 'PXC Pacific Global',
    Track: 'http://www.pacificexp.net/',
    Status: 1
  },
  {
    CourierId: 103,
    Courier: 'Smartr Priority',
    Description: 'Smartr Priority',
    Track: 'https://smartr.in/track.html?awb=',
    Status: 1
  },
  {
    CourierId: 104,
    Courier: 'Smartr Normal',
    Description: 'Smartr Normal',
    Track: 'https://smartr.in/track.html?awb=',
    Status: 1
  },
  {
    CourierId: 105,
    Courier: 'Skyex Normal',
    Description: 'Skyex Normal',
    Track: 'https://www.skyexpressinternational.com/Home/Tracking',
    Status: 1
  },
  {
    CourierId: 106,
    Courier: 'Skyex Priority',
    Description: 'Skyex Priority',
    Track: 'https://www.skyexpressinternational.com/Home/Tracking',
    Status: 1
  },
  {
    CourierId: 107,
    Courier: 'TCS Normal',
    Description: 'TCS Normal',
    Track: 'https://www.tscexpressbd.com/',
    Status: 1
  },
  {
    CourierId: 108,
    Courier: 'TCS Economy',
    Description: 'TCS Economy',
    Track: 'https://www.tscexpressbd.com/',
    Status: 1
  },
  {
    CourierId: 109,
    Courier: 'TNT Economy',
    Description: 'TNT Economy',
    Track: 'https://www.tnt.com/express/en_in/site/shipping-tools/tracking.html',
    Status: 1
  },
  {
    CourierId: 110,
    Courier: 'ECOM Normal',
    Description: 'ECOM Normal',
    Track: 'https://ecomexpress.in/',
    Status: 1
  },
  {
    CourierId: 111,
    Courier: 'SkyNet Normal',
    Description: 'Skynet Normal',
    Track: 'http://skynetindia.com/',
    Status: 1
  },
  {
    CourierId: 112,
    Courier: 'SkyNet Priority',
    Description: 'Skynet Priority',
    Track: 'http://skynetindia.com/',
    Status: 1
  },
  {
    CourierId: 120,
    Courier: 'AICS - Normal',
    Description: 'Arihant International Courier',
    Track: 'https://www.arihantcourier.com/tracking/?tracking_number=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 121,
    Courier: 'AICS - Priority',
    Description: 'Arihant International Courier',
    Track: 'https://www.arihantcourier.com/tracking/?tracking_number=<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 122,
    Courier: 'Elite Normal',
    Description: 'Elite Express Cargo LLC',
    Track: 'https://track.elite-co.com/',
    Status: 1
  },
  {
    CourierId: 123,
    Courier: 'Elite Economy',
    Description: 'Elite Express Cargo LLC',
    Track: 'https://track.elite-co.com/',
    Status: 1
  },
  {
    CourierId: 130,
    Courier: 'FEDEX Intl Priority',
    Description: '',
    Track: 'https://www.fedex.com/wtrk/track/?trknbr=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 131,
    Courier: 'DHL Priority',
    Description: '',
    Track: 'https://www.dhl.com/in-en/home/tracking/tracking-express.html?submit=1&tracking-id=<AWB>',
    Mode: 2,
    Status: 0
  },
  {
    CourierId: 132,
    Courier: 'Network Express',
    Description: 'Network Express',
    Track: 'https://www.networkcourier.com.sg/3DWEBSITE/index.aspx',
    Status: 1
  },
  {
    CourierId: 133,
    Courier: 'GATI Air',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.gati.com',
    Status: 1
  },
  {
    CourierId: 134,
    Courier: 'GATI Surface',
    Description: 'Normal / Express cargo ( air / surface)',
    Track: 'www.gati.com',
    Status: 1
  },
  {
    CourierId: 151,
    Courier: 'DPD Normal',
    Description: 'DPD Normal',
    Track: '',
    Status: 1
  },
  {
    CourierId: 152,
    Courier: 'DPD Priority',
    Description: 'DPD Priority',
    Track: '',
    Status: 1
  },
  {
    CourierId: 155,
    Courier: 'DTDC Express',
    Description: 'DTDC Express',
    Track: 'https://tracking.dtdc.com/ctbs-tracking/customerInterface.tr?submitName=showCITrackingDetails&cnNo=<AWB>&cType=Consignment',
    Status: 1
  },
  {
    CourierId: 161,
    Courier: 'Delhivery Cargo',
    Description: 'Delhivery Cargo',
    Track: 'https://www.delhivery.com/track/package/<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 162,
    Courier: 'Delhivery Economy',
    Description: 'Delhivery Economy',
    Track: 'https://www.delhivery.com/track/package/<AWB>',
    Mode: 2,
    Status: 1
  },
  {
    CourierId: 163,
    Courier: 'Smartr Normal',
    Description: 'Smartr Normal',
    Track: 'www.dtdc.in',
    Status: 1
  },
  {
    CourierId: 164,
    Courier: 'Smartr Express',
    Description: 'Smartr Express',
    Track: 'www.smartr.in',
    Status: 1
  },
  {
    CourierId: 170,
    Courier: 'eShipper Normal',
    Description: 'eShipper Normal',
    Track: 'https://eshipperuae.com/',
    Status: 1
  },
  {
    CourierId: 171,
    Courier: 'eShipper Economy',
    Description: 'eShipper Economy',
    Track: 'https://eshipperuae.com/',
    Status: 1
  },
  {
    CourierId: 176,
    Courier: 'DPD Duty Free',
    Description: '',
    Track: 'https://www.dpd.co.uk/',
    Status: 1
  },
  {
    CourierId: 177,
    Courier: 'DPD Duty Free - Express',
    Description: '',
    Track: 'https://www.dpd.co.uk/',
    Status: 1
  },
  {
    CourierId: 178,
    Courier: 'DPD Duty Free - Priority',
    Description: '',
    Track: 'https://www.dpd.co.uk/',
    Status: 1
  },
  {
    CourierId: 179,
    Courier: 'DPD Duty Free - Economy',
    Description: '',
    Track: 'https://www.dpd.co.uk/',
    Status: 1
  },
  {
    CourierId: 190,
    Courier: 'DPEX Economy',
    Description: 'Normal International',
    Track: 'www.dpex.com',
    Status: 1
  },
  {
    CourierId: 191,
    Courier: 'DPEX Priority',
    Description: 'Normal International',
    Track: 'www.dpex.com',
    Status: 1
  },
  {
    CourierId: 120,
    Courier: 'PROFESSIONAL Priority',
    Description: 'Normal / Express domestic Normal International',
    Track: 'http://www.tpcindia.com',
    Status: 1
  },
];
