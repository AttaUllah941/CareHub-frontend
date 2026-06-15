import {
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  effect,
  inject,
  input,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  Chart,
  ChartConfiguration,
  ChartType,
  registerables,
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  template: `<div class="relative h-64"><canvas #canvas></canvas></div>`,
})
export class LineChartComponent implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);

  readonly labels = input<string[]>([]);
  readonly data = input<number[]>([]);
  readonly label = input('Value');
  readonly color = input('#0d9488');
  readonly type = input<ChartType>('line');
  readonly currency = input<string | null>(null);

  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;

  constructor() {
    effect(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.render();
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(): void {
    const labels = this.labels();
    const data = this.data();
    if (!labels.length) return;

    const config: ChartConfiguration = {
      type: this.type(),
      data: {
        labels,
        datasets: [
          {
            label: this.label(),
            data,
            borderColor: this.color(),
            backgroundColor: this.type() === 'bar' ? `${this.color()}99` : `${this.color()}33`,
            fill: this.type() === 'line',
            tension: 0.3,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            ticks: { maxRotation: 45, minRotation: 0, font: { size: 10 } },
            grid: { display: false },
          },
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 10 },
              callback: (value) => {
                const curr = this.currency();
                return curr ? `${curr} ${value}` : String(value);
              },
            },
          },
        },
      },
    };

    if (this.chart) {
      this.chart.data = config.data!;
      this.chart.options = config.options!;
      this.chart.update();
    } else {
      this.chart = new Chart(this.canvasRef.nativeElement, config);
    }
  }
}
