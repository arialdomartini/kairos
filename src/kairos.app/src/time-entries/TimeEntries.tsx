import { IconButton, makeStyles, Typography } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import { format } from 'date-fns';
import React, { useCallback } from 'react';
import { Index } from 'react-virtualized';

import { formatAsDateTime } from '../code/constants';
import Spinner from '../components/Spinner';
import { VirtualizedTable } from '../components/VirtualizedTable';
import { TimeEntryModel } from '../models/time-entry.model';

const useStyles = makeStyles(theme => ({
  container: {
    height: '70vh',
    width: '100%',
  },
}));

export interface TimeEntriesInputs {
  timeEntries: TimeEntryModel[];
  isGetTimeEntriesBusy: boolean;
  isDeleteTimeEntryBusy: boolean;
}

export interface TimeEntriesDispatches {
  onUpdate: (item: TimeEntryModel) => void;
  onDelete: (item: TimeEntryModel) => void;
}

type TimeEntriesProps = TimeEntriesInputs & TimeEntriesDispatches;

export const TimeEntriesComponent: React.FC<TimeEntriesProps> = props => {
  const { timeEntries, isGetTimeEntriesBusy, isDeleteTimeEntryBusy, onUpdate, onDelete } = props;

  const classes = useStyles(props);

  const handleUpdate = useCallback((model: TimeEntryModel) => onUpdate(model), [onUpdate]);
  const handleDelete = useCallback((model: TimeEntryModel) => onDelete(model), [onDelete]);

  const noRowsRenderer = useCallback(() => <p>No time entries</p>, []);
  const rowGetter = useCallback(({ index }: Index) => timeEntries[index], [timeEntries]);
  const dateFormatter = useCallback((data: Date) => format(data, formatAsDateTime), []);
  const updateCellRenderer = useCallback(
    model => (
      <IconButton color="inherit" aria-label="Update entry" onClick={() => handleUpdate(model)}>
        <CreateIcon />
      </IconButton>
    ),
    [handleUpdate],
  );
  const deleteCellRenderer = useCallback(
    model => (
      <IconButton color="inherit" aria-label="Delete entry" onClick={() => handleDelete(model)}>
        <DeleteIcon />
      </IconButton>
    ),
    [handleDelete],
  );

  return (
    <Spinner show={isGetTimeEntriesBusy || isDeleteTimeEntryBusy}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Time Entries
      </Typography>
      <div className={classes.container}>
        <VirtualizedTable
          rowCount={timeEntries.length}
          noRowsRenderer={noRowsRenderer}
          rowGetter={rowGetter}
          columns={[
            {
              width: 100,
              label: 'Type',
              dataKey: 'type',
            },
            {
              width: 200,
              label: 'When',
              dataKey: 'when',
              flexGrow: 1,
              formatter: dateFormatter,
            },
            {
              width: 100,
              label: '',
              dataKey: '',
              cellRenderer: updateCellRenderer,
            },
            {
              width: 100,
              label: '',
              dataKey: '',
              cellRenderer: deleteCellRenderer,
            },
          ]}
        />
      </div>
    </Spinner>
  );
};