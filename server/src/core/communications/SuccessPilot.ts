import { Server, Socket } from 'socket.io';
import { SuccessPilotEngine } from '../../services/auraOS/SuccessPilotEngine';

/**
 * AURA_OS: SUCCESS PILOT COMMUNICATION v1.0
 * AI-Mediated Socket.io layer for monetization drive.
 */

export const attachPilot = (io: Server, socket: Socket) => {
  socket.on('send_message', async (data) => {
    // 1. Relay the message instantly to the secure channel
    socket.broadcast.emit('message_received', data);

    // 2. Run background intent analysis via AI
    const intervention = await SuccessPilotEngine.analyzeMessage(data.content);
    
    // 3. Trigger monetization prompts if high-intent detected
    if (intervention) {
      io.to(socket.id).emit('ai_intervention', intervention.intervention);
    }
  });
};
