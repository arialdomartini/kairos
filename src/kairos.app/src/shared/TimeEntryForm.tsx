import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { map } from 'ramda';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { isString } from '../code/is';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { getTransFromType, TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { Routes } from '../routes';
import {
  RefreshSelectsTimeEntryAction,
  SetModel,
  SetTimeEntrySelectedJobAction,
  SetTimeEntrySelectedProjectAction,
  SetTimeEntryTypeAction,
  SetTimeEntryWhenAction,
  useTimeEntryFormReducer,
} from './TimeEntryForm.store';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface TimeEntryFormProps {
  selectedLanguage: Language;
  profile: ProfileModel;
  model: TimeEntryModel;
  isBusy: boolean;
  onSave: (model: TimeEntryModel) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, isBusy, profile, model, onSave } = props;

  const [state, dispatch] = useTimeEntryFormReducer();
  const { id, when, type, jobs, selectedJobId, projects, selectedProjectId } = state;

  useEffect(() => {
    dispatch(RefreshSelectsTimeEntryAction(profile));
  }, [dispatch, profile]);

  const handleSave = useCallback(() => {
    if (!!when) {
      onSave(
        new TimeEntryModel(id, when, type, new UUID(selectedJobId), new UUID(selectedProjectId)),
      );
    }
  }, [onSave, id, type, when, selectedJobId, selectedProjectId]);

  const handleTypeChange = useCallback(
    (_, value: string) => dispatch(SetTimeEntryTypeAction(value as TimeEntryTypes)),
    [dispatch],
  );

  const handleWhenChange = useCallback(
    (when: MaterialUiPickersDate) => {
      dispatch(SetTimeEntryWhenAction(!!when ? when : new Date()));
      dispatch(RefreshSelectsTimeEntryAction(profile));
    },
    [dispatch, profile],
  );

  const handleJobChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(SetTimeEntrySelectedJobAction(event.target.value));
        dispatch(RefreshSelectsTimeEntryAction(profile));
      }
    },
    [dispatch, profile],
  );

  const handleProjectChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(SetTimeEntrySelectedProjectAction(event.target.value));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (!model.isEmpty()) {
      dispatch(SetModel(model));
    }
  }, [dispatch, model]);

  if (jobs.length === 0) {
    return (
      <div className={classes.hasPadding}>
        <Typography color="inherit" noWrap>
          <Trans>TimeEntryForm.YouNeedAtLeastOneJob</Trans>
          <Trans
            id="TimeEntryForm.Profile"
            components={[<Link to={Routes.Profile}>Profile</Link>]}
          />
          <Trans>
            See the <Link to="/more">description</Link> below.
          </Trans>
        </Typography>
      </div>
    );
  }

  return (
    <Grid container direction="column">
      <Grid
        className={classes.hasPadding}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="timeEntryType"
            name="timeEntryType"
            row
            value={type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value={TimeEntryTypes.IN}
              control={<Radio />}
              label={<Trans>Values.TimeEntryTypes.In</Trans>}
            />
            <FormControlLabel
              value={TimeEntryTypes.OUT}
              control={<Radio />}
              label={<Trans>Values.TimeEntryTypes.Out</Trans>}
            />
          </RadioGroup>
        </FormControl>
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={getDatepickerLocale(selectedLanguage)}
        >
          <KeyboardDateTimePicker
            margin="normal"
            ampm={false}
            autoOk
            value={when}
            onChange={handleWhenChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        {jobs.length > 1 && (
          <FormControl fullWidth>
            <InputLabel htmlFor="job">
              <Trans>Labels.Job</Trans>
            </InputLabel>
            <Select
              value={selectedJobId}
              onChange={handleJobChange}
              inputProps={{
                id: 'job',
              }}
            >
              {map(
                job => (
                  <MenuItem key={job.id.toString()} value={job.id.toString()}>
                    {job.name}
                  </MenuItem>
                ),
                jobs,
              )}
            </Select>
          </FormControl>
        )}
        <FormControl fullWidth>
          <InputLabel htmlFor="project">
            <Trans>Labels.Project</Trans>
          </InputLabel>
          <Select
            value={selectedProjectId}
            onChange={handleProjectChange}
            disabled={projects.length === 1}
            inputProps={{
              id: 'project',
            }}
          >
            {map(
              project => (
                <MenuItem key={project.id.toString()} value={project.id.toString()}>
                  {project.name}
                </MenuItem>
              ),
              projects,
            )}
          </Select>
        </FormControl>
      </Grid>
      <Divider />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.hasPadding}
      >
        <ButtonSpinner
          onClick={handleSave}
          isBusy={isBusy}
          disabled={!when || !selectedJobId || !selectedProjectId || isBusy}
        >
          {model.isEmpty() ? getTransFromType(type) : <SaveIcon />}
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
