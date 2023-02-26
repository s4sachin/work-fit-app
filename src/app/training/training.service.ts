import { Exercise } from './exercise.model';
import { Subject } from 'rxjs';

export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availabeExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 120, calories: 20 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 90, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 10 },
    { id: 'skipping', name: 'Skipping', duration: 180, calories: 35 },
  ];

  private runningExercise!: Exercise;
  private exercises: Exercise[] = [];

  getAvailableExercises() {
    return this.availabeExercises.slice();
  }

  startExercise(selectedId: string) {
    const selectedEx = this.availabeExercises.find(
      (ex) => ex.id === selectedId
    );
    this.runningExercise = selectedEx!;
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercise() {
    return this.exercises.slice();
  }
}
