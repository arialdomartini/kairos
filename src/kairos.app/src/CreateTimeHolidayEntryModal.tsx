import { Trans } from '@lingui/macro';
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { Language } from './models/language-model';
import { TimeHolidayEntryModel } from './models/time-holiday-entry.model';
import { TimeHolidayEntryForm } from './shared/TimeHolidayEntryForm';

export interface CreateTimeHolidayEntryModalInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  isBusy: boolean;
  isOpen: boolean;
}

export interface CreateTimeHolidayEntryModalDispatches {
  onCreate: (model: TimeHolidayEntryModel) => void;
  onClose: () => void;
}

type CreateTimeHolidayEntryModalProps = CreateTimeHolidayEntryModalInputs &
  CreateTimeHolidayEntryModalDispatches;

export const CreateTimeHolidayEntryModalComponent: React.FC<CreateTimeHolidayEntryModalProps> = props => {
  const { isOnline, selectedLanguage, isBusy, isOpen, onCreate, onClose } = props;
  return (
    <Dialog open={isOpen} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        <Trans>Create Holiday</Trans>
      </DialogTitle>
      <DialogContent>
        <TimeHolidayEntryForm
          isOnline={isOnline}
          selectedLanguage={selectedLanguage}
          isBusy={isBusy}
          model={new TimeHolidayEntryModel()}
          onSave={onCreate}
        />
      </DialogContent>
    </Dialog>
  );
};
