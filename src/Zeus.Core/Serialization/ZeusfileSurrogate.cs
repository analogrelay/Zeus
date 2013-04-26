using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Zeus.Serialization.Surrogates
{
    internal class ZeusfileSurrogate
    {
        public string AppName { get; set; }
        public IDictionary<string, ZeusServiceSurrogate> Services { get; set; }

        [JsonConstructor]
        public ZeusfileSurrogate()
        {
            Services = new Dictionary<string, ZeusServiceSurrogate>();
        }

        public ZeusfileSurrogate(Zeusfile file)
        {
            AppName = file.AppName;
            Services = file.Services.ToDictionary(s => s.Name, s => new ZeusServiceSurrogate(s));
        }

        public Zeusfile ToZeusfile()
        {
            var file = new Zeusfile();
            file.AppName = AppName;
            file.Services.AddRange(Services.Select(pair => CreateService(pair.Key, pair.Value)));
            return file;
        }

        private ZeusService CreateService(string name, ZeusServiceSurrogate serviceSurrogate)
        {
            var service = new ZeusService(name, serviceSurrogate.Type);
            service.Settings.AddRange(serviceSurrogate.Settings.Select(p => new ConfigurationSetting(p.Name, p.Required)));
            return service;
        }
    }

    internal class ZeusServiceSurrogate
    {
        public string Type { get; set; }
        public IList<ConfigurationSetting> Settings { get; set; }

        public ZeusServiceSurrogate()
        {
            Settings = new List<ConfigurationSetting>();
        }

        public ZeusServiceSurrogate(ZeusService service)
        {
            Type = service.Type;
            Settings = service.Settings;
        }
    }
}
