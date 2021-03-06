﻿using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using Kairos.Application.TimeAbsenceEntry.Dtos;
using Kairos.Common;

namespace Kairos.Application.TimeAbsenceEntry.Commands
{
    public class UpdateTimeAbsenceEntry : Command<Guid>
    {
        public UpdateTimeAbsenceEntry(TimeAbsenceEntryModel timeAbsenceEntry)
        {
            TimeAbsenceEntry = timeAbsenceEntry;
        }

        public TimeAbsenceEntryModel TimeAbsenceEntry { get; }
    }
}