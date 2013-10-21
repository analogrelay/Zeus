using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Zeus.Model
{
    public class ServiceRoleResource
    {
        public string Name { get; set; }
        public object Value { get; set; }
        public IList<ServiceRoleResource> Resources { get; set; }

        public ServiceRoleResource()
        {
            Resources = new List<ServiceRoleResource>();
        }
    }
}
