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
        public IDictionary<string, ZeusServiceSurrogate> Services { get; set; }

        [JsonConstructor]
        public ZeusfileSurrogate()
        {
            Services = new Dictionary<string, ZeusServiceSurrogate>();
        }

        public ZeusfileSurrogate(Zeusfile file)
        {
            Services = file.Services.ToDictionary(s => s.Name, s => new ZeusServiceSurrogate(s));
        }

        public Zeusfile ToZeusfile()
        {
            var file = new Zeusfile();
            file.Services.AddRange(Services.Select(pair => new ZeusService(pair.Key, pair.Value.Type)));
            return file;
        }
    }

    internal class ZeusServiceSurrogate
    {
        public string Type { get; set; }

        public ZeusServiceSurrogate()
        {
        }

        public ZeusServiceSurrogate(ZeusService service)
        {
            Type = service.Type;
        }
    }
}
