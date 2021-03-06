import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action, createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { i18n } from '../i18nLoader';
import { UUID } from '../models/uuid.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { deleteTimeHolidayEntries } from '../services/time-holiday-entry/time-holiday-entry.service';
import { askForConfirmation } from './ask-for-confirmation';
import {
  DELETE_TIME_HOLIDAY_ENTRIES,
  DELETE_TIME_HOLIDAY_ENTRIES_FAILURE,
  DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
  TRY_DELETE_TIME_HOLIDAY_ENTRIES,
} from './constants';
import { SharedState } from './state';

export const tryDeleteTimeHolidayEntriesAction = (ids: UUID[]) =>
  action(TRY_DELETE_TIME_HOLIDAY_ENTRIES, ids);

export const deleteTimeHolidayEntriesAsync = createAsyncAction(
  DELETE_TIME_HOLIDAY_ENTRIES,
  DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
  DELETE_TIME_HOLIDAY_ENTRIES_FAILURE,
)<void, void, string>();

function* doDeleteTimeHolidayEntries({
  payload,
}: ReturnType<typeof tryDeleteTimeHolidayEntriesAction>) {
  const confirmed = yield call(askForConfirmation, {
    title: null,
    message: i18n._(t`Are you sure you want to delete the selected holidays?`),
    rejectButton: null,
    approveButton: null,
  });

  if (!confirmed) {
    return;
  }

  try {
    yield put(deleteTimeHolidayEntriesAsync.request());

    yield call(deleteTimeHolidayEntries, payload);

    yield put(deleteTimeHolidayEntriesAsync.success());
  } catch (error) {
    yield put(deleteTimeHolidayEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(
    enqueueSnackbarAction(i18n._(t`Holiday Deleted`), {
      variant: 'success',
    }),
  );
}

export function* deleteTimeHolidayEntriesSaga() {
  yield takeLatest(TRY_DELETE_TIME_HOLIDAY_ENTRIES, doDeleteTimeHolidayEntries);
  yield takeLatest(DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS, doNotifySuccess);
}

export const deleteTimeHolidayEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_HOLIDAY_ENTRIES:
        draft.ui.busy.deleteTimeHolidayEntries = true;
        break;
      case DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS:
        draft.ui.busy.deleteTimeHolidayEntries = false;
        break;
      case DELETE_TIME_HOLIDAY_ENTRIES_FAILURE:
        draft.ui.busy.deleteTimeHolidayEntries = false;
        break;
    }
  });
