import { Exercise } from './exercise.model';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availabeExercises: Exercise[] = [];
  private runningExercise!: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) => {
            //throw new Error();
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                name: doc.payload.doc.get('name'),
                duration: doc.payload.doc.get('duration'),
                calories: doc.payload.doc.get('calories'),
              };
            });
          })
        )
        .subscribe((exercises) => {
          this.availabeExercises = exercises;
          this.exercisesChanged.next([
            ...(this.availabeExercises as Exercise[]),
          ]);
        })
    );
  }

  startExercise(selectedId: string) {
    const selectedEx = this.availabeExercises.find(
      (ex) => ex.id === selectedId
    );
    this.runningExercise = selectedEx!;
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChanged.next(null!);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
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

  fetchCompletedOrCancelledExercise() {
    this.fbSubs.push(
      this.db
        .collection('finishedExercise')
        .valueChanges()
        .subscribe((exercises) =>
          this.finishedExercisesChanged.next(exercises as Exercise[])
        )
    );
  }

  cancelSubs() {
    this.fbSubs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercise').add(exercise);
  }
}
