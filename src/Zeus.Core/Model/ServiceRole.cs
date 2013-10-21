using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Model
{
    public class ServiceRole
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public IList<ServiceRoleResource> Resources { get; set; }

        public ServiceRole()
        {
            Resources = new List<ServiceRoleResource>();
        }
    }
}
