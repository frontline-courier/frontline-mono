export enum TransportMode {
    Air = 'Air',
    Cargo = 'Cargo',
    AirCargo = 'Air Cargo',
    SeaCargo = 'Sea Cargo',
    SurfaceCargo = 'Surface Cargo',
    Surface = 'Surface',
    TrainSurface = 'TrainSurface',
    RoadSurface = 'RoadSurface',
    NA = 'NA',
}

export function getTransportMode(shipment: number): string {
    switch (shipment) {
        case 1:
            return TransportMode.Air.toString();
        case 2:
            return TransportMode.Cargo.toString();
        case 3:
            return TransportMode.AirCargo.toString();
        case 4:
            return TransportMode.SeaCargo.toString();
        case 5:
            return TransportMode.SurfaceCargo.toString();
        case 6:
            return TransportMode.Surface.toString();
        case 7:
            return TransportMode.TrainSurface.toString();
        case 8:
            return TransportMode.RoadSurface.toString();
        case 9:
            return TransportMode.NA.toString();
        default:
            return TransportMode.NA.toString();
    }
}
