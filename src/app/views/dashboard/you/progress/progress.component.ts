import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration } from 'chart.js/auto';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {
  @ViewChild('workoutChart') chartCanvas!: ElementRef;
  private chart: Chart | undefined;

  // Générer dynamiquement les 8 dernières semaines avec labels de type "13-19"
  getLast8WeeksLabels(): { label: string, start: Date, end: Date }[] {
    const labels: { label: string, start: Date, end: Date }[] = [];
    const now = new Date();
    // Trouver le dernier dimanche (fin de la semaine)
    const lastSunday = new Date(now);
    lastSunday.setDate(now.getDate() - now.getDay());
    for (let i = 7; i >= 0; i--) {
      const end = new Date(lastSunday);
      end.setDate(lastSunday.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(end.getDate() - 6);
      const label = `${start.getDate()}-${end.getDate()}`;
      labels.push({ label, start, end });
    }
    return labels;
  }

  // Données simulées pour 8 semaines
  workoutData = [3, 5, 4, 6, 2, 7, 5, 4];

  @Input() current: number = 3;
  @Input() goal: number = 7;

  readonly radius = 45;
  readonly circumference = 2 * Math.PI * this.radius;

  get dashoffset(): number {
    return this.circumference * (1 - this.current / this.goal);
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChart();
  }

  private createChart() {
    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const weekLabels = this.getLast8WeeksLabels();
    const labels = weekLabels.map(w => w.label);
    if (this.chart) this.chart.destroy();
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: "Nombre d'entraînements",
          data: this.workoutData,
          borderColor: '#DC2626',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          tension: 0.4,
          fill: false,
          pointBackgroundColor: '#DC2626',
          pointBorderColor: '#DC2626',
          pointRadius: 4,
          pointHoverRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#222',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 8,
            displayColors: false
          }
        },
        scales: {
          x: {
            ticks: {
              color: '#fff',
              font: {
                size: 11
              }
            },
            grid: {
              color: 'rgba(255,255,255,0.1)',
            }
          },
          y: {
            position: 'right',
            beginAtZero: true,
            ticks: {
              color: '#fff',
              stepSize: 1,
              font: {
                size: 11
              },
              padding: 8
            },
            grid: {
              color: 'rgba(255,255,255,0.1)',
            }
          }
        },
        layout: {
          padding: {
            left: 5,
            right: 15,
            top: 10,
            bottom: 20 // plus de place pour le mois
          }
        }
      },
      plugins: [this.dataLabelPlugin(), this.monthLabelPlugin(weekLabels)]
    });
  }

  // Plugin pour afficher la valeur à droite de chaque point
  private dataLabelPlugin() {
    return {
      id: 'customDataLabels',
      afterDatasetsDraw: (chart: any) => {
        const ctx = chart.ctx;
        chart.data.datasets.forEach((dataset: any, i: number) => {
          const meta = chart.getDatasetMeta(i);
          meta.data.forEach((point: any, index: number) => {
            const value = dataset.data[index];
            ctx.save();
            ctx.font = 'bold 13px Arial';
            ctx.fillStyle = '#DC2626';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillText(value, point.x + 8, point.y);
            ctx.restore();
          });
        });
      }
    };
  }

  // Plugin pour afficher le mois sous la première semaine du mois
  private monthLabelPlugin(weekLabels: { label: string, start: Date, end: Date }[]) {
    return {
      id: 'monthLabel',
      afterDraw: (chart: any) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = 'bold 12px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        const xAxis = chart.scales.x;
        let lastMonth: string | null = null;
        weekLabels.forEach((week, i) => {
          const month = week.start.toLocaleString('fr-FR', { month: 'long' });
          if (lastMonth !== month) {
            // Position du label sous le tick
            const x = xAxis.getPixelForTick(i);
            const y = xAxis.bottom + 8;
            ctx.fillText(month, x, y);
            lastMonth = month;
          }
        });
        ctx.restore();
      }
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
} 