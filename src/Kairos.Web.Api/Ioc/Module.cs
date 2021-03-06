﻿using System;
using Autofac;
using GraphQL;
using GraphQL.Http;
using GraphQL.Types;
using Kairos.Application;
using Kairos.Config.Ioc;
using Kairos.Web.Api.GraphQL;
using Kairos.Web.Api.GraphQL.Country.Types;
using Kairos.Web.Api.GraphQL.TimeAbsenceEntry.Types;
using Kairos.Web.Api.GraphQL.TimeEntry.Types;
using Kairos.Web.Api.GraphQL.TimeHolidayEntry.Types;
using Kairos.Web.Api.GraphQL.Types;
using Kairos.Web.Api.GraphQL.UserProfile.Types;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace Kairos.Web.Api.Ioc
{
    public class Module : Autofac.Module
    {
        private readonly IConfiguration _configuration;

        public Module(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule(new Config.Ioc.Module(_configuration,
                new ModuleOptions {HasReadRepository = true, HasWriteRepository = true}));

            builder.RegisterModule(new Application.Ioc.Module());
            
            builder.RegisterType<HttpContextAccessor>()
                .As<IHttpContextAccessor>()
                .SingleInstance();
            
            builder.RegisterType<AuthProvider>().As<IAuthProvider>().InstancePerLifetimeScope();

            RegisterGraphQL(builder);
        }

        private void RegisterGraphQL(ContainerBuilder builder)
        {
            builder.RegisterInstance(new DocumentExecuter()).As<IDocumentExecuter>();
            builder.RegisterInstance(new DocumentWriter()).As<IDocumentWriter>();

            RegisterTypes(builder);

            builder.Register<Func<Type, GraphType>>(c =>
            {
                var context = c.Resolve<IComponentContext>();
                return t =>
                {
                    var res = context.Resolve(t);
                    return (GraphType) res;
                };
            });
        }

        private static void RegisterTypes(ContainerBuilder builder)
        {
            builder.RegisterType<CreateOrUpdateOutputType>()
                .AsSelf();
            builder.RegisterType<CreateOrUpdateOutputsType>()
                .AsSelf();

            builder.RegisterType<CountryType>()
                .AsSelf();
            
            builder.RegisterType<TimeEntryType>()
                .AsSelf();
            builder.RegisterType<TimeEntryTypeEnum>()
                .AsSelf();
            builder.RegisterType<TimeEntryInputType>()
                .AsSelf();
            
            builder.RegisterType<TimeAbsenceEntryType>()
                .AsSelf();
            builder.RegisterType<TimeAbsenceEntryTypeEnum>()
                .AsSelf();
            builder.RegisterType<TimeAbsenceEntryInputType>()
                .AsSelf();
            
            builder.RegisterType<TimeHolidayEntryType>()
                .AsSelf();
            builder.RegisterType<TimeHolidayEntryInputType>()
                .AsSelf();
            
            builder.RegisterType<UserProfileType>()
                .AsSelf();
            builder.RegisterType<UserProfileInputType>()
                .AsSelf();
            builder.RegisterType<UserJobType>()
                .AsSelf();
            builder.RegisterType<UserJobInputType>();

            builder.RegisterType<KairosQuery>()
                .AsSelf();
            builder.RegisterType<KairosMutation>()
                .AsSelf();
            builder.RegisterType<KairosSchema>()
                .As<ISchema>();
        }
    }
}