import { put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from 'typesafe-actions';
import { LOGIN_FAILURE } from '../auth/constants';
import {
  BULK_INSERT_TIME_ABSENCE_ENTRIES_FAILURE,
  BULK_INSERT_TIME_ENTRIES_FAILURE,
  BULK_INSERT_TIME_HOLIDAY_ENTRIES_FAILURE,
} from '../bulk-insert/constants';
import {
  GET_TIME_ABSENCE_ENTRY_FAILURE,
  UPDATE_TIME_ABSENCE_ENTRY_FAILURE,
} from '../edit-time-absence-entry/constants';
import {
  GET_TIME_ENTRY_FAILURE,
  UPDATE_TIME_ENTRY_FAILURE,
} from '../edit-time-entry/constants';
import {
  EXPORT_TIME_ABSENCE_ENTRIES_FAILURE,
  EXPORT_TIME_ENTRIES_FAILURE,
} from '../export/constants';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { UPDATE_PROFILE_FAILURE } from '../profile/constants';
import {
  CREATE_TIME_ABSENCE_ENTRY_FAILURE,
  CREATE_TIME_ENTRY_FAILURE,
  CREATE_TIME_HOLIDAY_ENTRY_FAILURE,
  DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
  DELETE_TIME_ENTRIES_FAILURE,
  DELETE_TIME_HOLIDAY_ENTRIES_FAILURE,
  GET_COUNTRIES_FAILURE,
  GET_TIME_ABSENCE_ENTRIES_FAILURE,
  GET_TIME_ENTRIES_FAILURE,
  GET_TIME_HOLIDAY_ENTRIES_FAILURE,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_FAILURE,
} from './constants';

function* doNotifyError(action: PayloadAction<string, string>) {
  if (!!action.payload) {
    yield put(
      enqueueSnackbarAction(action.payload.toString(), { variant: 'error' }),
    );
  }
}

export function* notifyError() {
  yield takeLatest(
    [
      LOGIN_FAILURE,
      GET_TIME_ENTRIES_FAILURE,
      CREATE_TIME_ENTRY_FAILURE,
      DELETE_TIME_ENTRIES_FAILURE,
      GET_TIME_ENTRY_FAILURE,
      UPDATE_TIME_ENTRY_FAILURE,
      GET_TIME_ABSENCE_ENTRIES_FAILURE,
      CREATE_TIME_ABSENCE_ENTRY_FAILURE,
      DELETE_TIME_ABSENCE_ENTRIES_FAILURE,
      GET_TIME_ABSENCE_ENTRY_FAILURE,
      UPDATE_TIME_ABSENCE_ENTRY_FAILURE,
      BULK_INSERT_TIME_ENTRIES_FAILURE,
      BULK_INSERT_TIME_ABSENCE_ENTRIES_FAILURE,
      BULK_INSERT_TIME_HOLIDAY_ENTRIES_FAILURE,
      CREATE_TIME_HOLIDAY_ENTRY_FAILURE,
      DELETE_TIME_HOLIDAY_ENTRIES_FAILURE,
      GET_TIME_HOLIDAY_ENTRIES_FAILURE,
      UPDATE_PROFILE_FAILURE,
      GET_COUNTRIES_FAILURE,
      UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_FAILURE,
      EXPORT_TIME_ENTRIES_FAILURE,
      EXPORT_TIME_ABSENCE_ENTRIES_FAILURE,
    ],
    doNotifyError,
  );
}
