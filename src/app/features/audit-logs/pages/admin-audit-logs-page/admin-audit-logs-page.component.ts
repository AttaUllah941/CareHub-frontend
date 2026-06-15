import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe, JsonPipe } from '@angular/common';
import { AuditLogService } from '../../services/audit-log.service';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { AUDIT_ACTIONS, AUDIT_MODULES, AuditAction } from '../../../../core/models/audit-log.model';

@Component({
  selector: 'app-admin-audit-logs-page',
  standalone: true,
  imports: [FormsModule, DatePipe, JsonPipe, AlertComponent, PaginationComponent],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold">Audit Logs</h1>
        <p class="text-sm text-gray-500">Full system audit trail — logins, updates, deletes, and approvals</p>
      </div>

      @if (auditService.error()) {
        <app-alert [message]="auditService.error()!" variant="error" />
      }

      <div class="bg-white border rounded-xl p-4 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        <input class="border rounded-lg px-3 py-2 text-sm" placeholder="Search..." [(ngModel)]="search" (keyup.enter)="apply()" />
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="action">
          <option value="">All actions</option>
          @for (a of actions; track a) { <option [value]="a">{{ a }}</option> }
        </select>
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="module">
          <option value="">All modules</option>
          @for (m of modules; track m) { <option [value]="m">{{ m }}</option> }
        </select>
        <select class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="successFilter">
          <option value="">All results</option>
          <option value="true">Success only</option>
          <option value="false">Failed only</option>
        </select>
        <input type="date" class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="fromDate" />
        <input type="date" class="border rounded-lg px-3 py-2 text-sm" [(ngModel)]="toDate" />
        <button type="button" (click)="apply()" class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm">Apply Filters</button>
        <button type="button" (click)="reset()" class="px-4 py-2 bg-gray-100 rounded-lg text-sm">Reset</button>
      </div>

      <div class="grid lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="text-left p-3 font-medium">Time</th>
                  <th class="text-left p-3 font-medium">Action</th>
                  <th class="text-left p-3 font-medium">Module</th>
                  <th class="text-left p-3 font-medium">Actor</th>
                  <th class="text-left p-3 font-medium">Entity</th>
                  <th class="text-left p-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                @for (log of auditService.logs(); track log.id) {
                  <tr
                    class="hover:bg-gray-50 cursor-pointer"
                    [class.bg-teal-50]="auditService.selectedLog()?.id === log.id"
                    (click)="auditService.selectLog(log)"
                  >
                    <td class="p-3 whitespace-nowrap text-xs">{{ log.createdAt | date: 'short' }}</td>
                    <td class="p-3"><span [class]="actionClass(log.action)">{{ log.action }}</span></td>
                    <td class="p-3">{{ log.module }}</td>
                    <td class="p-3">{{ actorName(log) }}</td>
                    <td class="p-3 truncate max-w-[140px]" [title]="log.entityLabel">{{ log.entityLabel || log.entityId || '—' }}</td>
                    <td class="p-3">
                      <span [class]="log.success ? 'text-green-600' : 'text-red-600'">{{ log.success ? 'OK' : 'Failed' }}</span>
                    </td>
                  </tr>
                } @empty {
                  <tr><td colspan="6" class="p-8 text-center text-gray-500">No audit logs found</td></tr>
                }
              </tbody>
            </table>
          </div>
          @if (auditService.pagination(); as p) {
            <div class="p-4 border-t">
              <app-pagination [page]="p.page" [totalPages]="p.totalPages" (pageChange)="onPage($event)" />
            </div>
          }
        </div>

        <div class="bg-white border rounded-xl p-5">
          <h2 class="font-semibold mb-4">Event Details</h2>
          @if (auditService.selectedLog(); as log) {
            <dl class="space-y-3 text-sm">
              <div><dt class="text-gray-500">Description</dt><dd>{{ log.description || '—' }}</dd></div>
              <div><dt class="text-gray-500">Actor Email</dt><dd>{{ log.actor?.email || log.actorEmail || '—' }}</dd></div>
              <div><dt class="text-gray-500">Role</dt><dd>{{ log.actor?.role || log.actorRole || '—' }}</dd></div>
              <div><dt class="text-gray-500">Entity Type</dt><dd>{{ log.entityType || '—' }}</dd></div>
              <div><dt class="text-gray-500">Entity ID</dt><dd class="break-all text-xs">{{ log.entityId || '—' }}</dd></div>
              <div><dt class="text-gray-500">IP Address</dt><dd>{{ log.ipAddress || '—' }}</dd></div>
              <div><dt class="text-gray-500">User Agent</dt><dd class="text-xs break-all">{{ log.userAgent || '—' }}</dd></div>
              @if (log.metadata && (log.metadata | json) !== '{}') {
                <div>
                  <dt class="text-gray-500 mb-1">Metadata</dt>
                  <dd class="bg-gray-50 rounded-lg p-3 text-xs overflow-auto max-h-64 font-mono">{{ log.metadata | json }}</dd>
                </div>
              }
            </dl>
          } @else {
            <p class="text-gray-500 text-sm">Select a log entry to view full details</p>
          }
        </div>
      </div>
    </div>
  `,
})
export class AdminAuditLogsPageComponent implements OnInit {
  protected readonly auditService = inject(AuditLogService);
  readonly actions = AUDIT_ACTIONS;
  readonly modules = AUDIT_MODULES;

  search = '';
  action = '';
  module = '';
  successFilter = '';
  fromDate = '';
  toDate = '';

  ngOnInit(): void {
    this.auditService.loadLogs({});
  }

  apply(): void {
    this.auditService.loadLogs({
      page: 1,
      search: this.search || undefined,
      action: (this.action as AuditAction) || undefined,
      module: this.module || undefined,
      success: this.successFilter === '' ? undefined : this.successFilter === 'true',
      fromDate: this.fromDate || undefined,
      toDate: this.toDate || undefined,
    });
  }

  reset(): void {
    this.search = '';
    this.action = '';
    this.module = '';
    this.successFilter = '';
    this.fromDate = '';
    this.toDate = '';
    this.auditService.loadLogs({ page: 1 });
  }

  onPage(page: number): void {
    this.auditService.loadLogs({ page });
  }

  actorName(log: { actor?: { firstName?: string; lastName?: string; email?: string }; actorEmail?: string }): string {
    if (log.actor) return `${log.actor.firstName ?? ''} ${log.actor.lastName ?? ''}`.trim() || log.actor.email || '—';
    return log.actorEmail || '—';
  }

  actionClass(action: string): string {
    const base = 'px-2 py-0.5 rounded text-xs font-medium ';
    if (action === 'LOGIN' || action === 'APPROVE') return base + 'bg-green-100 text-green-800';
    if (action === 'LOGIN_FAILED' || action === 'REJECT' || action === 'DELETE') return base + 'bg-red-100 text-red-800';
    if (action === 'UPDATE') return base + 'bg-blue-100 text-blue-800';
    return base + 'bg-gray-100 text-gray-800';
  }
}
