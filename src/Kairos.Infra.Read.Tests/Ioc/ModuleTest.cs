﻿using System;
using Kairos.Config.Ioc;
using Kairos.Infra.Read.TimeAbsenceEntry;
using Kairos.Infra.Read.TimeEntry;
using Kairos.Infra.Read.TimeHolidayEntry;
using Kairos.Infra.Read.UserProfile;
using Kairos.Test.Common;
using Xunit;

namespace Kairos.Infra.Read.Tests.Ioc
{
    public class ModuleTest : IDisposable
    {
        private readonly ScopeResolver _scopeResolver;

        public ModuleTest()
        {
            _scopeResolver = new ScopeResolver();

            var configBuilder = new ConfigBuilder();

            _scopeResolver.BuildContainer(
                new Module(configBuilder.Build(), new ModuleOptions {HasReadRepository = true}),
                new Read.Ioc.Module());
        }

        [Fact]
        public void should_resolve_IReadConnectionFactory()
        {
            _scopeResolver.IsSingleInstance<IReadConnectionFactory, ReadConnectionFactory>();
        }

        [Fact]
        public void should_resolve_ReadRepositoryFactory()
        {
            _scopeResolver.IsSingleInstance<ReadRepositoryFactory>();
        }

        [Fact]
        public void should_resolve_ITimeEntryReadRepository()
        {
            _scopeResolver.IsSingleInstance<ITimeEntryReadRepository, TimeEntryReadRepository>();
        }
        
        [Fact]
        public void should_resolve_ITimeAbsenceEntryReadRepository()
        {
            _scopeResolver.IsSingleInstance<ITimeAbsenceEntryReadRepository, TimeAbsenceEntryReadRepository>();
        }
        
        [Fact]
        public void should_resolve_ITimeHolidayEntryReadRepository()
        {
            _scopeResolver.IsSingleInstance<ITimeHolidayEntryReadRepository, TimeHolidayEntryReadRepository>();
        }
        
        [Fact]
        public void should_resolve_IUserProfileReadRepository()
        {
            _scopeResolver.IsSingleInstance<IUserProfileReadRepository, UserProfileReadRepository>();
        }

        public void Dispose()
        {
            _scopeResolver.Dispose();
        }
    }
}