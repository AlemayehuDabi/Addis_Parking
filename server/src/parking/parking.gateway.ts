import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'ws';
import { ParkingService } from './parking.service';

@WebSocketGateway(8080) // Separate port for IoT if preferred
export class ParkingGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly parkingService: ParkingService) {}

  @SubscribeMessage('update_status')
  async handleUpdate(client: any, payload: string) {
    const data = JSON.parse(payload); // { sensorId: 1, isParked: true }
    
    // Process through service to avoid unnecessary DB hits
    const changed = await this.parkingService.processStatusUpdate(data.sensorId, data.isParked);
    
    // If state actually changed, broadcast to the Website Frontend
    if (changed) {
      this.server.clients.forEach(c => c.send(JSON.stringify({ event: 'ui_update', ...data })));
    }
  }
}