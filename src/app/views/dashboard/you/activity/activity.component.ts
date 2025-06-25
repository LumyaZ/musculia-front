import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-activity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent {
  searchTerm: string = '';
  isMobile: boolean = window.innerWidth < 900;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < 900;
  }

  workouts: any[] = [
    {
      id: 1,
      title: 'Séance Musculation',
      sessionDate: new Date(),
      location: 'Salle FitClub',
      partner: 'Alex',
      notes: 'Bonne séance, progression sur le développé couché.',
      workoutDetails: [
        {
          exercise: { name: 'Développé couché' },
          repetitions: 10,
          sets: 4,
          weight: 80
        },
        {
          exercise: { name: 'Pompes' },
          repetitions: 20,
          sets: 3
        },
        {
          exercise: { name: 'Corde à sauter' },
          repetitions: 100
        }
      ],
      carouselIndex: 0
    },
    {
      id: 2,
      title: 'Cardio Extérieur',
      sessionDate: new Date(),
      location: 'Parc',
      notes: 'Séance cardio intense.',
      workoutDetails: [
        {
          exercise: { name: 'Course à pied' },
          repetitions: 1,
          sets: 1
        }
      ],
      carouselIndex: 0
    }
  ];

  filteredWorkouts() {
    if (!this.searchTerm) return this.workouts;
    const term = this.searchTerm.toLowerCase();
    return this.workouts.filter(w =>
      (w.title && w.title.toLowerCase().includes(term)) ||
      (w.location && w.location.toLowerCase().includes(term))
    );
  }

  nextExercise(workout: any) {
    if (!workout.workoutDetails || workout.workoutDetails.length === 0) return;
    workout.carouselIndex = (workout.carouselIndex + 1) % workout.workoutDetails.length;
  }

  prevExercise(workout: any) {
    if (!workout.workoutDetails || workout.workoutDetails.length === 0) return;
    workout.carouselIndex = (workout.carouselIndex - 1 + workout.workoutDetails.length) % workout.workoutDetails.length;
  }
} 