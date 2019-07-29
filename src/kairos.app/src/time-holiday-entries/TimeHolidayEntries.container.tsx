import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Actions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { deleteTimeHolidayEntryAsync } from '../shared/delete-time-holiday-entry';
import {
  selectIsDeleteTimeHolidayEntryBusy,
  selectIsGetTimeHolidayEntriesBusy,
  selectTimeHolidayEntries,
} from '../shared/selectors';
import { State } from '../state';
import {
  TimeHolidayEntriesComponent,
  TimeHolidayEntriesDispatches,
  TimeHolidayEntriesInputs,
} from './TimeHolidayEntries';

const mapStateToProps = (state: State): TimeHolidayEntriesInputs => ({
  timeHolidayEntries: selectTimeHolidayEntries(state),
  isGetTimeHolidayEntriesBusy: selectIsGetTimeHolidayEntriesBusy(state),
  isDeleteTimeHolidayEntryBusy: selectIsDeleteTimeHolidayEntryBusy(state),
});

const mapDispatchToProps = (dispatch: Dispatch<Actions>): TimeHolidayEntriesDispatches => ({
  onUpdate: (model: TimeHolidayEntryModel) => dispatch(push(`/holiday/${model.id}`)),
  onDelete: (model: TimeHolidayEntryModel) =>
    dispatch(deleteTimeHolidayEntryAsync.request({ model })),
});

export const TimeHolidayEntries = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeHolidayEntriesComponent);
