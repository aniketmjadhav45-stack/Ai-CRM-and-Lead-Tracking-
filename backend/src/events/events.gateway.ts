import { 
  WebSocketGateway, 
  WebSocketServer, 
  SubscribeMessage, 
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // In production, restrict to frontend URL
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // For MVP, clients can pass orgId in query params: ws://localhost:3001?orgId=123
    const orgId = client.handshake.query.orgId as string;
    if (orgId) {
      client.join(orgId); // Join a room specific to their organization
      console.log(`Client connected: ${client.id} joined room: ${orgId}`);
    } else {
      console.log(`Client connected: ${client.id} without orgId`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Method to emit events to a specific organization from other backend services
  emitToOrganization(orgId: string, eventName: string, payload: any) {
    this.server.to(orgId).emit(eventName, payload);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    client.emit('pong', { message: 'pong received', timestamp: new Date() });
  }
}
