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

  // Générer dynamiquement les 8 dernières semaines
  getLast8WeeksLabels(): string[] {
    const labels: string[] = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);
      const week = this.getWeekNumber(d);
      labels.push(`S${week}`);
    }
    return labels;
  }

  // Helper pour obtenir le numéro de semaine
  getWeekNumber(d: Date): number {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    const weekNum = Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1)/7);
    return weekNum;
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
    const labels = this.getLast8WeeksLabels();
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
            bottom: 5
          }
        }
      },
      plugins: [this.dataLabelPlugin()]
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
            ctx.font = '11px Arial';
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

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
} 