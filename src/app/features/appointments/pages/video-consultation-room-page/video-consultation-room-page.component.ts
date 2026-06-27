import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-video-consultation-room-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './video-consultation-room-page.component.html',
  styleUrl: './video-consultation-room-page.component.scss',
})
export class VideoConsultationRoomPageComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  protected readonly authService = inject(AuthService);

  readonly roomRef = signal('');
  readonly jitsiRoomName = signal('');
  readonly loadError = signal<string | null>(null);

  private jitsiScriptEl: HTMLScriptElement | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const ref = params.get('roomRef') ?? '';
      this.roomRef.set(ref);
      this.jitsiRoomName.set(`CareHub-${ref.replace(/[^a-zA-Z0-9-]/g, '')}`);
      if (this.isBrowser && ref) {
        this.initJitsi();
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser && this.roomRef()) {
      this.initJitsi();
    }
  }

  ngOnDestroy(): void {
    if (this.jitsiScriptEl?.parentNode) {
      this.jitsiScriptEl.parentNode.removeChild(this.jitsiScriptEl);
    }
  }

  private initJitsi(): void {
    const container = this.document.getElementById('jitsi-container');
    if (!container || !this.jitsiRoomName()) return;

    container.innerHTML = '';

    const user = this.authService.user();
    const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Guest';

    const startMeeting = (): void => {
      const api = (window as unknown as { JitsiMeetExternalAPI?: new (...args: unknown[]) => void })
        .JitsiMeetExternalAPI;
      if (!api) {
        this.loadError.set('Video provider failed to load. Please refresh and try again.');
        return;
      }

      new api('meet.jit.si', {
        roomName: this.jitsiRoomName(),
        parentNode: container,
        width: '100%',
        height: 560,
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: true,
          prejoinPageEnabled: true,
        },
      });
    };

    if ((window as unknown as { JitsiMeetExternalAPI?: unknown }).JitsiMeetExternalAPI) {
      startMeeting();
      return;
    }

    const script = this.document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => startMeeting();
    script.onerror = () => this.loadError.set('Could not load video meeting. Check your connection.');
    this.document.body.appendChild(script);
    this.jitsiScriptEl = script;
  }
}
