import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { deleteTimeAbsenceEntry } from '../services/time-absence-entry/time-absence-entry.service';
import {
  DELETE_TIME_ABSENCE_ENTRY,
  DELETE_TIME_ABSENCE_ENTRY_FAILURE,
  DELETE_TIME_ABSENCE_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';

export const deleteTimeAbsenceEntryAsync = createAsyncAction(
  DELETE_TIME_ABSENCE_ENTRY,
  DELETE_TIME_ABSENCE_ENTRY_SUCCESS,
  DELETE_TIME_ABSENCE_ENTRY_FAILURE,
)<{ model: TimeAbsenceEntryModel }, void, string>();

function* doDeleteTimeAbsenceEntry({
  payload: { model },
}: ReturnType<typeof deleteTimeAbsenceEntryAsync.request>) {
  try {
    yield call(deleteTimeAbsenceEntry, model.id);

    yield put(deleteTimeAbsenceEntryAsync.success());
  } catch (error) {
    yield put(deleteTimeAbsenceEntryAsync.failure(error.message));
  }
}

export function* deleteTimeAbsenceEntrySaga() {
  yield takeLatest(DELETE_TIME_ABSENCE_ENTRY, doDeleteTimeAbsenceEntry);
}

export const deleteTimeAbsenceEntryReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_ABSENCE_ENTRY:
        draft.ui.busy.deleteTimeAbsenceEntry = true;
        break;
      case DELETE_TIME_ABSENCE_ENTRY_SUCCESS:
        draft.ui.busy.deleteTimeAbsenceEntry = false;
        break;
      case DELETE_TIME_ABSENCE_ENTRY_FAILURE:
        draft.ui.busy.deleteTimeAbsenceEntry = false;
        break;
    }
  });