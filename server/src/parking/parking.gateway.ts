import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { ParkingService } from './parking.service';

@WebSocketGateway(8000, {
  cors: {
    origin: '*',
  },
})
export class ParkingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  constructor(private readonly parkingService: ParkingService) {}

  afterInit(server: Server) {
    console.log('✅ WebSocket Server initialized on port 8080');
  }

  handleConnection(client: WebSocket) {
    console.log('🚀 New client connected (ESP32 or Frontend)');
  }

  handleDisconnect(client: WebSocket) {
    console.log('❌ Client disconnected');
  }

  /**
   * This is triggered when the ESP32 sends the "update_status" event
   */
  @SubscribeMessage('update_status')
  async handleUpdate(client: any, payload: any) {
    try {
      // 1. Extract data safely (handles both nested and flat payloads)
      const sensorData = payload.data ? payload.data : payload;
      const { sensorId, isParked } = sensorData;

      if (sensorId === undefined || isParked === undefined) {
        console.warn('⚠️ Received incomplete data from hardware:', payload);
        return;
      }

      console.log(
        `📡 Hardware Signal: Sensor ${sensorId} -> ${isParked ? 'Occupied' : 'Free'}`,
      );

      // 2. Update the Database via Service
      // The service should return TRUE only if the status actually changed in the DB
      const hasChanged = await this.parkingService.processStatusUpdate(
        Number(sensorId),
        Boolean(isParked),
      );

      // 3. BROADCAST to Frontend
      // We always broadcast if hasChanged is true to keep the UI in sync
      if (hasChanged) {
        console.log(
          `📣 Change Detected: Sensor ${sensorId} is now ${isParked}`,
        );

        const uiUpdateMessage = JSON.stringify({
          event: 'ui_update', // Matches your frontend message.event check
          data: {
            sensorId,
            isParked,
          },
        });

        console.log(`📣 Broadcasting to Frontend: Sensor ${sensorId}`);

        this.server.clients.forEach((c) => {
          if (c.readyState === WebSocket.OPEN) {
            console.log('sended');
            c.send(uiUpdateMessage);
          }
        });
      }
    } catch (error) {
      console.error('❌ Gateway Error:', error.message);
    }
  }

  // Optional: Handle the ESP32 connection test message
  @SubscribeMessage('connection_test')
  handleTest(client: any, payload: any) {
    console.log('🧪 ESP32 Connection Test:', payload);
  }
}
