import DateFnsUtils from '@date-io/date-fns';
import { t, Trans } from '@lingui/macro';
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, IconButton, makeStyles, TextField, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { KeyboardDatePicker, MaterialUiPickersDate, MuiPickersUtilsProvider } from '@material-ui/pickers';
import clsx from 'clsx';
import { endOfDay } from 'date-fns';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { formatAsDate } from '../code/constants';
import { formatDate } from '../code/formatters';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { useFocus } from '../code/use-focus';
import { Themes } from '../code/variables';
import { i18n } from '../i18nLoader';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  rows: {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  columns: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  responsiveColumns: {
    width: '100%',
    display: 'grid',
    gridAutoFlow: 'row',
    [theme.breakpoints.up('sm')]: {
      gridAutoFlow: 'column',
    },
    gridGap: theme.spacing(1),
    alignItems: 'center',
  },
  between: {
    justifyContent: 'space-between',
  },
  selfCenter: {
    justifySelf: 'center',
  },
  noGap: {
    gridGap: 0,
  },
  paper: { padding: theme.spacing(3) },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  secondaryPaper: {
    backgroundColor: Themes.Second.backgroundColor,
    color: Themes.Second.color,
    padding: theme.spacing(2, 3),
  },
}));

export interface ProfileJobFormInputs {
  selectedLanguage: Language;
  job: JobModel;
}

export interface ProfileJobFormDispatches {
  onJobDelete: (jobId: UUID) => void;
  onJobNameChange: (jobId: UUID, name: string) => void;
  onJobStartDateChange: (jobId: UUID, date: Date) => void;
  onJobEndDateChange: (jobId: UUID, date: Date | null) => void;
  onJobHolidaysPerYearChange: (jobId: UUID, days: number) => void;
  onJobDayChange: (jobId: UUID, day: string, hours: number) => void;
}

type ProfileJobFormProps = ProfileJobFormInputs & ProfileJobFormDispatches;

export const ProfileJobForm: React.FC<ProfileJobFormProps> = props => {
  const classes = useStyles(props);

  const {
    selectedLanguage,
    job,
    onJobDelete,
    onJobNameChange,
    onJobStartDateChange,
    onJobEndDateChange,
    onJobHolidaysPerYearChange,
    onJobDayChange,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const [inputRef, setInputFocus] = useFocus();

  const handleJobDelete = useCallback(() => onJobDelete(job.id), [
    onJobDelete,
    job,
  ]);

  const handleJobNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onJobNameChange(job.id, event.currentTarget.value),
    [onJobNameChange, job],
  );

  const handleJobStartDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onJobStartDateChange(job.id, date);
      }
    },
    [onJobStartDateChange, job],
  );

  const handleJobEndDateChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!!date) {
        onJobEndDateChange(job.id, endOfDay(date));
      } else {
        onJobEndDateChange(job.id, null);
      }
    },
    [onJobEndDateChange, job],
  );

  const handleHolidaysPerYear = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onJobHolidaysPerYearChange(job.id, event.currentTarget.valueAsNumber),
    [onJobHolidaysPerYearChange, job],
  );

  const handleJobDayChange = useCallback(
    (day: string) => (event: ChangeEvent<HTMLInputElement>) =>
      onJobDayChange(job.id, day, event.currentTarget.valueAsNumber),
    [onJobDayChange, job],
  );

  const handleMondayChange = useCallback(handleJobDayChange('monday'), [
    handleJobDayChange,
  ]);
  const handleTuesdayChange = useCallback(handleJobDayChange('tuesday'), [
    handleJobDayChange,
  ]);
  const handleWednesdayChange = useCallback(handleJobDayChange('wednesday'), [
    handleJobDayChange,
  ]);
  const handleThursdayChange = useCallback(handleJobDayChange('thursday'), [
    handleJobDayChange,
  ]);
  const handleFridayChange = useCallback(handleJobDayChange('friday'), [
    handleJobDayChange,
  ]);
  const handleSaturdayChange = useCallback(handleJobDayChange('saturday'), [
    handleJobDayChange,
  ]);
  const handleSundayChange = useCallback(handleJobDayChange('sunday'), [
    handleJobDayChange,
  ]);

  const handleExpanded = useCallback(
    (evt, newExp) => {
      setTimeout(() => setInputFocus(), 200);
      setExpanded(newExp);
    },
    [setExpanded, setInputFocus],
  );

  const handlePreventCompress = useCallback(evt => evt.stopPropagation(), []);

  const maxDate = new Date(8640000000000000);
  const minDate = new Date(0);

  return (
    <ExpansionPanel expanded={expanded} onChange={handleExpanded}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className={clsx(classes.columns, classes.between)}>
          <div className={classes.heading}>
            {expanded ? (
              <TextField
                inputRef={inputRef}
                margin="dense"
                fullWidth
                label={<Trans>Name</Trans>}
                type="text"
                value={job.name}
                onClick={handlePreventCompress}
                onChange={handleJobNameChange}
              />
            ) : (
              <Typography>
                {!!job.name ? job.name : i18n._(t`Unknown`)}
              </Typography>
            )}
          </div>
          <Typography className={classes.secondaryHeading}>
            {`${formatDate(job.start, selectedLanguage, formatAsDate)} - ${
              !!job.end
                ? formatDate(job.end, selectedLanguage, formatAsDate)
                : i18n._(t`Current Date`)
            }`}
          </Typography>
          <IconButton
            color="inherit"
            aria-label="Delete entry"
            onClick={handleJobDelete}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <div className={classes.rows}>
          <div className={classes.responsiveColumns}>
            <MuiPickersUtilsProvider
              utils={DateFnsUtils}
              locale={getDatepickerLocale(selectedLanguage)}
            >
              <KeyboardDatePicker
                autoOk
                fullWidth
                value={job.start}
                maxDate={!!job.end ? job.end : maxDate}
                onChange={handleJobStartDateChange}
                label={<Trans>Start</Trans>}
                invalidDateMessage={<Trans>Invalid Date</Trans>}
                format={formatAsDate}
              />
              <KeyboardDatePicker
                autoOk
                fullWidth
                value={job.end}
                minDate={!!job.start ? job.start : minDate}
                invalidDateMessage={<Trans>Invalid Date</Trans>}
                onChange={handleJobEndDateChange}
                label={<Trans>End</Trans>}
                format={formatAsDate}
              />
            </MuiPickersUtilsProvider>
            <TextField
              margin="dense"
              fullWidth
              label={<Trans>Holidays (days per year)</Trans>}
              inputProps={{ min: 0, max: 365, step: 1 }}
              type="number"
              value={job.holidaysPerYear}
              onChange={handleHolidaysPerYear}
            />
          </div>
          <div className={classes.responsiveColumns}>
            <TextField
              label={<Trans>Monday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.monday}
              onChange={handleMondayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Thursday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.tuesday}
              onChange={handleTuesdayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Wednesday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.wednesday}
              onChange={handleWednesdayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Thursday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.thursday}
              onChange={handleThursdayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Friday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.friday}
              onChange={handleFridayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Saturday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.saturday}
              onChange={handleSaturdayChange}
            />
            <TextField
              margin="dense"
              label={<Trans>Sunday</Trans>}
              inputProps={{ min: 0, max: 23.59, step: 0.1 }}
              type="number"
              value={job.sunday}
              onChange={handleSundayChange}
            />
          </div>
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};
