export type VideoSessionStatus = 'WAITING' | 'ACTIVE' | 'ENDED' | 'CANCELLED';
export type VideoRecordingStatus = 'PENDING' | 'RECORDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface IceServerConfig {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface VideoParticipant {
  id?: string;
  userId: string;
  role: 'DOCTOR' | 'PATIENT' | 'ADMIN';
  joinedAt?: string;
  leftAt?: string | null;
  audioEnabled?: boolean;
  videoEnabled?: boolean;
  screenSharing?: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    role?: string;
  };
}

export interface VideoRecording {
  id?: string;
  status: VideoRecordingStatus;
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
  storageUrl?: string | null;
  storageKey?: string;
}

export interface VideoSession {
  id: string;
  appointmentId: string;
  consultationId?: string | null;
  roomId: string;
  status: VideoSessionStatus;
  patientUserId: string;
  doctorUserId: string;
  participants: VideoParticipant[];
  recordings: VideoRecording[];
  iceServers?: IceServerConfig[];
  startedAt?: string;
  endedAt?: string;
  patient?: { id: string; firstName: string; lastName: string };
  doctor?: { id: string; firstName: string; lastName: string };
}

export interface VideoChatMessage {
  id: string;
  sessionId: string;
  senderUserId: string;
  message: string;
  messageType?: 'TEXT' | 'SYSTEM';
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    role?: string;
  };
}

export interface VideoSessionResponse {
  session: VideoSession;
  iceServers: IceServerConfig[];
}

export type SignalType = 'offer' | 'answer' | 'ice-candidate';

export interface VideoSignalPayload {
  type: SignalType;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
  fromUserId?: string;
  fromSocketId?: string;
}
