import { Injectable } from '@angular/core';
import { Gender, Goal, TrainingPreference } from '../_models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private genderTranslations: { [key in Gender]: string } = {
    [Gender.MALE]: 'Homme',
    [Gender.FEMALE]: 'Femme',
    [Gender.OTHER]: 'Autre'
  };

  private goalTranslations: { [key in Goal]: string } = {
    [Goal.MUSCLE_GAIN]: 'Prise de muscle',
    [Goal.WEIGHT_LOSS]: 'Perte de poids',
    [Goal.TONING]: 'Tonification'
  };

  private trainingPreferenceTranslations: { [key in TrainingPreference]: string } = {
    [TrainingPreference.STRENGTH]: 'Force',
    [TrainingPreference.HYPERTROPHY]: 'Hypertrophie',
    [TrainingPreference.ENDURANCE]: 'Endurance'
  };

  translateGender(gender: Gender | undefined): string {
    return gender ? this.genderTranslations[gender] : '';
  }

  translateGoal(goal: Goal | undefined): string {
    return goal ? this.goalTranslations[goal] : '';
  }

  translateTrainingPreference(preference: TrainingPreference | undefined): string {
    return preference ? this.trainingPreferenceTranslations[preference] : '';
  }
} 